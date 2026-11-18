import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  User,
  MapPin,
  Users,
  GraduationCap,
  Upload,
  CheckCircle2,
  Send,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Trash2,
  Eye,
  AlertTriangle,
  Lock,
  RefreshCw,
  Calendar,
  Check,
  AlertCircle,
  FileText,
  CreditCard,
  Clock,
} from 'lucide-react';
import PaymentGatewayModal from '../../components/payment/PaymentGatewayModal';
import applicationService from '../../services/application.service';
import documentService from '../../services/document.service';
import Stepper from '../../components/ui/Stepper';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import IndianStateDropdown from '../../components/ui/IndianStateDropdown';
import IndianCityDropdown from '../../components/ui/IndianCityDropdown';
import { isValidIndianState, validateIndianCity } from '../../constants/indiaGeoData';
import { DOCUMENT_TYPES } from '../../constants/config';

// Uniform Warning Message Component for standard, uniform warning styling
const UniformWarning = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <div className={`mt-1.5 flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-300 shadow-2xs ${className}`}>
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      <span className="font-medium">{message.startsWith('Warning:') ? message : `Warning: ${message}`}</span>
    </div>
  );
};

// Calculate exact age from date of birth string
const getCalculatedAge = (dobString) => {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  if (dob > today) return -1; // Future / negative age
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Parse existing blood group (e.g. "O+") into ABO type and Rh factor
const parseBloodGroup = (bgStr) => {
  if (!bgStr) return { type: '', rh: '' };
  const match = bgStr.trim().match(/^(A|B|AB|O)([+-])$/i);
  if (match) {
    return { type: match[1].toUpperCase(), rh: match[2] };
  }
  return { type: '', rh: '' };
};

export const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Submit confirmation dialog
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [declarationChecked, setDeclarationChecked] = useState(false);

  // Application Fee Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [applicationFeePayment, setApplicationFeePayment] = useState(null);

  // Success Confirmation Modal
  const [submitSuccessModalOpen, setSubmitSuccessModalOpen] = useState(false);
  const [submittedAppInfo, setSubmittedAppInfo] = useState(null);

  // Browser navigation warning banner (when browser back button is clicked)
  const [browserBackWarning, setBrowserBackWarning] = useState(false);

  // Blood group & Rh factor selection states
  const [bloodType, setBloodType] = useState('');
  const [rhFactor, setRhFactor] = useState('');

  // Date of Birth limits: Age between 16 and 30
  const today = new Date();
  const maxDobDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()).toISOString().split('T')[0];
  const minDobDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate()).toISOString().split('T')[0];

  // Disable browser back button navigation to protect form state
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      setBrowserBackWarning(true);
      setTimeout(() => setBrowserBackWarning(false), 5000);
    };
    window.addEventListener('popstate', handlePopState);

    const handleBeforeUnload = (e) => {
      if (application?.status === 'DRAFT') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes in your application form. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [application?.status]);

  // Section Form States
  const [personal, setPersonal] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'MALE',
    blood_group: '',
    category: 'GENERAL',
    nationality: 'Indian',
    aadhar_number: '',
  });

  const [contact, setContact] = useState({
    email: '',
    phone: '',
    alternate_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [guardian, setGuardian] = useState({
    father_name: '',
    father_occupation: '',
    father_phone: '',
    mother_name: '',
    mother_occupation: '',
    mother_phone: '',
    guardian_name: '',
    guardian_relation: '',
    annual_income: '5-10 Lakhs',
  });

  const [academic, setAcademic] = useState({
    tenth_board: 'CBSE',
    tenth_school: '',
    tenth_year: '2022',
    tenth_percentage: '',
    twelfth_board: 'CBSE',
    twelfth_school: '',
    twelfth_year: '2024',
    twelfth_percentage: '',
    entrance_exam_name: 'WBJEE',
    entrance_roll_number: '',
    entrance_rank: '',
  });

  // Blood group selection handler
  const handleBloodGroupChange = (typeVal, rhVal) => {
    setBloodType(typeVal);
    setRhFactor(rhVal);
    const combined = typeVal && rhVal ? `${typeVal}${rhVal}` : '';
    setPersonal((prev) => ({ ...prev, blood_group: combined }));
    if (combined && validationErrors.blood_group) {
      setValidationErrors((prev) => ({ ...prev, blood_group: null }));
    }
  };

  // Name formatting helper: First letter MUST be capital, subsequent letters may be capital or small, strictly no numbers
  const formatCapName = (val) => {
    if (!val) return '';
    const noNumbers = val.replace(/[0-9]/g, '');
    const validChars = noNumbers.replace(/[^A-Za-z\s.'-]/g, '');
    const trimmedLeading = validChars.replace(/^\s+/, '');
    if (!trimmedLeading) return '';
    return trimmedLeading.charAt(0).toUpperCase() + trimmedLeading.slice(1);
  };

  // Name input handler: First letter must be capital, remaining letters may be capital or small, strictly no numbers
  const handleCapitalizedNameChange = (field, rawValue, stateSetter, stateObj) => {
    const hadNumbers = /[0-9]/.test(rawValue);
    const cleaned = formatCapName(rawValue);

    stateSetter({ ...stateObj, [field]: cleaned });

    if (hadNumbers) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: 'Warning: Numbers are strictly prohibited in names. Only letters are allowed.',
      }));
    } else if (cleaned && !/^[A-Z]/.test(cleaned)) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: 'Warning: First letter must be a capital letter (A-Z).',
      }));
    } else if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [uploadingType, setUploadingType] = useState(null);

  const steps = [
    { title: 'Personal' },
    { title: 'Contact' },
    { title: 'Guardian' },
    { title: 'Academic' },
    { title: 'Documents' },
    { title: 'Review' },
    { title: 'Submit' },
  ];

  const loadApplication = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationService.getApplicationById(id);
      const app = res.data;
      setApplication(app);

      if (app.personalInfo) {
        setPersonal((prev) => ({
          ...prev,
          ...app.personalInfo,
          first_name: formatCapName(app.personalInfo.first_name),
          middle_name: app.personalInfo.middle_name ? formatCapName(app.personalInfo.middle_name) : '',
          last_name: formatCapName(app.personalInfo.last_name),
        }));
        const parsed = parseBloodGroup(app.personalInfo.blood_group);
        setBloodType(parsed.type);
        setRhFactor(parsed.rh);
      }
      if (app.contactInfo) {
        setContact((prev) => ({ ...prev, ...app.contactInfo }));
      }
      if (app.guardianInfo) {
        setGuardian((prev) => ({
          ...prev,
          ...app.guardianInfo,
          father_name: formatCapName(app.guardianInfo.father_name),
          mother_name: formatCapName(app.guardianInfo.mother_name),
          guardian_name: app.guardianInfo.guardian_name ? formatCapName(app.guardianInfo.guardian_name) : '',
        }));
      }
      if (app.academicInfo) {
        setAcademic((prev) => ({ ...prev, ...app.academicInfo }));
      }
      if (app.documents) {
        setDocuments(app.documents);
      }

      // Check if application fee (₹500) has been paid
      const feePay = app.payments?.find(
        (p) => p.payment_type === 'APPLICATION_FEE' && p.status === 'SUCCESS'
      );
      if (feePay) {
        setApplicationFeePayment(feePay);
      }

      // If already submitted, open in Review step (Step 6)
      if (app.status !== 'DRAFT') {
        setCurrentStep(6);
      } else {
        setCurrentStep(app.current_step || 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to load application data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [id]);

  // Step 1: Save Personal Info with 12-digit Aadhaar, Age & Compulsory Blood Group Validation
  const handleSavePersonal = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const newErrors = {};

    if (!personal.first_name?.trim()) {
      newErrors.first_name = 'First name is required.';
    } else if (/[0-9]/.test(personal.first_name)) {
      newErrors.first_name = 'Numbers are strictly prohibited in names.';
    } else if (!/^[A-Z]/.test(personal.first_name.trim())) {
      newErrors.first_name = 'First letter must be a capital letter (A-Z).';
    } else if (!/^[A-Z][A-Za-z\s.'-]*$/.test(personal.first_name.trim())) {
      newErrors.first_name = 'First letter must be capital; remaining letters may be capital or small.';
    }

    if (personal.middle_name?.trim()) {
      if (/[0-9]/.test(personal.middle_name)) {
        newErrors.middle_name = 'Numbers are strictly prohibited in names.';
      } else if (!/^[A-Z]/.test(personal.middle_name.trim())) {
        newErrors.middle_name = 'First letter must be a capital letter (A-Z).';
      } else if (!/^[A-Z][A-Za-z\s.'-]*$/.test(personal.middle_name.trim())) {
        newErrors.middle_name = 'First letter must be capital; remaining letters may be capital or small.';
      }
    }

    if (!personal.last_name?.trim()) {
      newErrors.last_name = 'Last name is required.';
    } else if (/[0-9]/.test(personal.last_name)) {
      newErrors.last_name = 'Numbers are strictly prohibited in names.';
    } else if (!/^[A-Z]/.test(personal.last_name.trim())) {
      newErrors.last_name = 'First letter must be a capital letter (A-Z).';
    } else if (!/^[A-Z][A-Za-z\s.'-]*$/.test(personal.last_name.trim())) {
      newErrors.last_name = 'First letter must be capital; remaining letters may be capital or small.';
    }

    if (!personal.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required.';
    } else {
      const calculatedAge = getCalculatedAge(personal.date_of_birth);
      if (calculatedAge === null || calculatedAge < 0) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future (age cannot be negative).';
      } else if (calculatedAge < 16 || calculatedAge > 30) {
        newErrors.date_of_birth = `Age must be between 16 and 30 years (cannot be negative). Current calculated age is ${calculatedAge} years.`;
      }
    }

    // Blood group is compulsory with Rh factor
    if (!personal.blood_group || !bloodType || !rhFactor) {
      newErrors.blood_group = 'Blood group is compulsory. Please select both Blood Group (A, B, AB, O) and Rh Factor (Rh+ or Rh-).';
    } else if (!/^(A|B|AB|O)[+-]$/.test(personal.blood_group)) {
      newErrors.blood_group = 'Please select a valid Blood Group (A, B, AB, O) and Rh Factor (Rh+ or Rh-).';
    }

    // Aadhaar Card Validation: Must be 12 digits
    const cleanAadhaar = (personal.aadhar_number || '').replace(/[\s\-]/g, '');
    if (cleanAadhaar && !/^\d{12}$/.test(cleanAadhaar)) {
      newErrors.aadhar_number = 'Aadhaar card number must be exactly 12 numeric digits (e.g. 1234 5678 9012).';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setError('Please resolve the highlighted validation errors before continuing.');
      setSaving(false);
      return;
    }

    setValidationErrors({});

    try {
      await applicationService.updatePersonalInfo(id, {
        ...personal,
        first_name: personal.first_name.trim().toUpperCase(),
        middle_name: personal.middle_name ? personal.middle_name.trim().toUpperCase() : null,
        last_name: personal.last_name.trim().toUpperCase(),
        blood_group: `${bloodType}${rhFactor}`,
        aadhar_number: cleanAadhaar || null,
      });
      setSuccessMsg('Personal details saved successfully.');
      setCurrentStep(2);
    } catch (err) {
      setError(err.message || 'Failed to save personal details.');
    } finally {
      setSaving(false);
    }
  };

  // Step 2: Save Contact Info with 10-digit Phone & 6-digit Pincode Validation
  const handleSaveContact = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const newErrors = {};

    if (!contact.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    // Phone validation for 10 digits as for +91 code
    const phoneClean = (contact.phone || '').trim();
    if (!phoneClean) {
      newErrors.phone = 'Primary phone number is required.';
    } else if (!/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210 or +91 9876543210).';
    }

    // Alternate Phone validation if provided
    const altPhoneClean = (contact.alternate_phone || '').trim();
    if (altPhoneClean && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(altPhoneClean)) {
      newErrors.alternate_phone = 'Alternate contact must be a valid 10-digit mobile number.';
    }

    if (!contact.address_line1?.trim()) {
      newErrors.address_line1 = 'Permanent address line 1 is required.';
    } else if (/(?:^|\s|#|;|,|\/)-[0-9]+/.test(contact.address_line1) || /-[0-9]+/.test(contact.address_line1)) {
      newErrors.address_line1 = 'Address Line 1 cannot contain negative numbers (e.g. -1, -5). Please enter positive building/plot/street numbers.';
    }

    if (contact.address_line2?.trim() && (/(?:^|\s|#|;|,|\/)-[0-9]+/.test(contact.address_line2) || /-[0-9]+/.test(contact.address_line2))) {
      newErrors.address_line2 = 'Address Line 2 cannot contain negative numbers.';
    }

    if (!contact.state?.trim()) {
      newErrors.state = 'State is required. Please select from the 28 Indian States or UTs.';
    } else if (!isValidIndianState(contact.state)) {
      newErrors.state = 'Please select a valid Indian State from the 28 states of India or recognized Union Territories.';
    }

    if (!contact.city?.trim()) {
      newErrors.city = 'City is required. Please select or enter a valid recognized Indian city.';
    } else if (/[0-9]/.test(contact.city) || /-[0-9]/.test(contact.city)) {
      newErrors.city = 'City name cannot contain numbers or negative signs.';
    } else {
      const cityValidation = validateIndianCity(contact.city, contact.state);
      if (!cityValidation.valid) {
        newErrors.city = `Invalid city: "${contact.city.trim()}" is not a recognized Indian city. Please select a valid recognized Indian city or district from the list.`;
      }
    }

    // 6-digit positive Indian PIN code validation (no negative numbers)
    const pinClean = (contact.pincode || '').trim();
    if (!pinClean) {
      newErrors.pincode = 'Pincode is required.';
    } else if (/-/.test(pinClean)) {
      newErrors.pincode = 'Pincode cannot be negative or contain minus signs.';
    } else if (!/^[1-9][0-9]{5}$/.test(pinClean)) {
      newErrors.pincode = 'Pincode must be exactly 6 positive numeric digits (e.g. 700091). Cannot be negative or start with 0.';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setError('Please resolve the highlighted contact validation errors before continuing.');
      setSaving(false);
      return;
    }

    setValidationErrors({});

    try {
      await applicationService.updateContactInfo(id, contact);
      setSuccessMsg('Contact details saved successfully.');
      setCurrentStep(3);
    } catch (err) {
      setError(err.message || 'Failed to save contact details.');
    } finally {
      setSaving(false);
    }
  };

  // Step 3: Save Guardian Info with 10-digit Phone Validation & Capitalized Name Constraints
  const handleSaveGuardian = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const newErrors = {};

    if (!guardian.father_name?.trim()) {
      newErrors.father_name = "Father's full name is required.";
    } else if (/[0-9]/.test(guardian.father_name)) {
      newErrors.father_name = "Numbers are strictly prohibited in father's name.";
    } else if (!/^[A-Z]/.test(guardian.father_name.trim())) {
      newErrors.father_name = "First letter of father's name must be a capital letter (A-Z).";
    } else if (!/^[A-Z][A-Za-z\s.'-]*$/.test(guardian.father_name.trim())) {
      newErrors.father_name = "First letter must be capital; remaining letters may be capital or small.";
    }

    if (!guardian.mother_name?.trim()) {
      newErrors.mother_name = "Mother's full name is required.";
    } else if (/[0-9]/.test(guardian.mother_name)) {
      newErrors.mother_name = "Numbers are strictly prohibited in mother's name.";
    } else if (!/^[A-Z]/.test(guardian.mother_name.trim())) {
      newErrors.mother_name = "First letter of mother's name must be a capital letter (A-Z).";
    } else if (!/^[A-Z][A-Za-z\s.'-]*$/.test(guardian.mother_name.trim())) {
      newErrors.mother_name = "First letter must be capital; remaining letters may be capital or small.";
    }

    if (guardian.guardian_name?.trim()) {
      if (/[0-9]/.test(guardian.guardian_name)) {
        newErrors.guardian_name = "Numbers are strictly prohibited in guardian's name.";
      } else if (!/^[A-Z]/.test(guardian.guardian_name.trim())) {
        newErrors.guardian_name = "First letter of guardian's name must be a capital letter (A-Z).";
      } else if (!/^[A-Z][A-Za-z\s.'-]*$/.test(guardian.guardian_name.trim())) {
        newErrors.guardian_name = "First letter must be capital; remaining letters may be capital or small.";
      }
    }

    const fatherPhoneClean = (guardian.father_phone || '').trim();
    if (fatherPhoneClean && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(fatherPhoneClean)) {
      newErrors.father_phone = "Father's phone must be a valid 10-digit mobile number.";
    }

    const motherPhoneClean = (guardian.mother_phone || '').trim();
    if (motherPhoneClean && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(motherPhoneClean)) {
      newErrors.mother_phone = "Mother's phone must be a valid 10-digit mobile number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setError('Please resolve the highlighted guardian validation errors before continuing.');
      setSaving(false);
      return;
    }

    setValidationErrors({});

    try {
      await applicationService.updateGuardianInfo(id, guardian);
      setSuccessMsg('Guardian details saved successfully.');
      setCurrentStep(4);
    } catch (err) {
      setError(err.message || 'Failed to save guardian details.');
    } finally {
      setSaving(false);
    }
  };

  const handleStepClick = (step) => {
    // If trying to navigate beyond Academic records and 12th % is under 60%, redirect to not-eligible
    const twelfthPct = parseFloat(academic.twelfth_percentage);
    if (step > 4 && !isNaN(twelfthPct) && twelfthPct < 60) {
      navigate(`/applicant/applications/${id}/not-eligible`, {
        state: {
          percentage: academic.twelfth_percentage,
          departmentName: application?.department?.name,
          degree: application?.department?.degree,
          applicationId: application?.application_id,
          id: id,
        },
      });
      return;
    }
    setCurrentStep(step);
  };

  // Step 4: Save Academic Info with Percentage, Minimum Cutoff & Positive GMR Check
  const handleSaveAcademic = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const newErrors = {};

    // 10th Percentage validation (Positive, min 50%, max 100%)
    if (academic.tenth_percentage === '' || academic.tenth_percentage === null || academic.tenth_percentage === undefined) {
      newErrors.tenth_percentage = 'Class 10th percentage is required.';
    } else {
      const tenthRaw = String(academic.tenth_percentage).trim();
      const tenthPct = parseFloat(tenthRaw);
      if (tenthRaw.includes('-') || isNaN(tenthPct) || tenthPct < 0) {
        newErrors.tenth_percentage = '10th percentage must be a positive number (cannot be negative).';
      } else if (tenthPct > 100) {
        newErrors.tenth_percentage = '10th percentage cannot exceed 100%.';
      } else if (tenthPct < 50) {
        newErrors.tenth_percentage = `Minimum requirement not fulfilled: Class 10th requires at least 50% (Current: ${tenthPct}%).`;
      }
    }

    // 12th Percentage validation (Positive, min 60%, max 100%)
    let twelfthPct = NaN;
    if (academic.twelfth_percentage === '' || academic.twelfth_percentage === null || academic.twelfth_percentage === undefined) {
      newErrors.twelfth_percentage = 'Class 12th overall percentage is required.';
    } else {
      const twelfthRaw = String(academic.twelfth_percentage).trim();
      twelfthPct = parseFloat(twelfthRaw);
      if (twelfthRaw.includes('-') || isNaN(twelfthPct) || twelfthPct < 0) {
        newErrors.twelfth_percentage = '12th percentage must be a positive number (cannot be negative).';
      } else if (twelfthPct > 100) {
        newErrors.twelfth_percentage = '12th percentage cannot exceed 100%.';
      } else if (twelfthPct < 60) {
        newErrors.twelfth_percentage = `Minimum requirement not fulfilled: Minimum 60% aggregate in Class 12th is required for admission (Current: ${twelfthPct}%).`;
      }
    }

    // General Merit Rank (GMR) validation: Must be strictly positive integer and below 10 Lakhs (1 - 1,000,000)
    if (academic.entrance_rank !== '' && academic.entrance_rank !== null && academic.entrance_rank !== undefined) {
      const gmrRaw = String(academic.entrance_rank).trim();
      const gmrVal = Number(gmrRaw);
      if (gmrRaw.includes('-') || isNaN(gmrVal) || gmrVal <= 0) {
        newErrors.entrance_rank = 'General Merit Rank (GMR) must be a positive number (cannot be negative or zero).';
      } else if (gmrVal > 1000000) {
        newErrors.entrance_rank = `General Merit Rank (GMR) must be below 10 Lakhs (1 - 10,00,000). Current: ${gmrVal.toLocaleString('en-IN')}.`;
      }
    }

    if (!academic.tenth_school?.trim()) {
      newErrors.tenth_school = '10th School name is required.';
    }

    if (!academic.twelfth_school?.trim()) {
      newErrors.twelfth_school = '12th College / School name is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      setError('Please resolve the highlighted academic validation errors before continuing.');
      setSaving(false);
      return;
    }

    setValidationErrors({});

    try {
      await applicationService.updateAcademicInfo(id, academic);

      if (!isNaN(twelfthPct) && twelfthPct < 60) {
        navigate(`/applicant/applications/${id}/not-eligible`, {
          state: {
            percentage: academic.twelfth_percentage,
            departmentName: application?.department?.name,
            degree: application?.department?.degree,
            applicationId: application?.application_id,
            id: id,
          },
        });
        return;
      }

      setSuccessMsg('Academic details saved successfully.');
      setCurrentStep(5);
    } catch (err) {
      setError(err.message || 'Failed to save academic details.');
    } finally {
      setSaving(false);
    }
  };

  // Step 5: Document Upload Handler
  const handleFileUpload = async (docType, file) => {
    if (!file) return;
    setUploadingType(docType);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', docType);

    try {
      const res = await documentService.uploadDocument(id, formData);
      // Refresh documents
      const docsRes = await documentService.getDocuments(id);
      setDocuments(docsRes.data || []);
      setSuccessMsg(`${docType.replace('_', ' ')} uploaded successfully.`);
    } catch (err) {
      setError(err.message || 'Document upload failed.');
    } finally {
      setUploadingType(null);
    }
  };

  // Document Delete Handler
  const handleDeleteDoc = async (docId) => {
    if (!confirm('Are you sure you want to remove this document?')) return;
    try {
      await documentService.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      setError(err.message || 'Failed to delete document.');
    }
  };

  // Final Submit with Document & Completeness Verification
  const handleFinalSubmit = async () => {
    if (!declarationChecked) {
      setError('Please check the accuracy confirmation declaration checkbox.');
      return;
    }

    // Check mandatory documents: Photograph, ID Proof, Marksheets
    const hasPhoto = documents.some((d) => d.document_type === 'photograph');
    const hasId = documents.some((d) => d.document_type === 'id_proof');
    const hasMarksheet = documents.some((d) => d.document_type === 'marksheet_10th' || d.document_type === 'marksheet_12th');

    const missingDocs = [];
    if (!hasPhoto) missingDocs.push('Passport Photograph');
    if (!hasId) missingDocs.push('Government ID Proof (Aadhaar)');
    if (!hasMarksheet) missingDocs.push('Marksheets (Class 10th / 12th)');

    if (missingDocs.length > 0) {
      setConfirmSubmitOpen(false);
      setError(`Cannot submit incomplete application. Please upload mandatory documents: ${missingDocs.join(', ')}.`);
      setCurrentStep(5);
      return;
    }

    // If application fee of ₹500 is not paid yet, launch payment gateway
    if (!applicationFeePayment) {
      setConfirmSubmitOpen(false);
      setPaymentModalOpen(true);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await applicationService.submitApplication(id);
      setConfirmSubmitOpen(false);
      setSubmittedAppInfo(res.data || application);
      setSubmitSuccessModalOpen(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
      setApplication((prev) => ({
        ...prev,
        status: 'SUBMITTED',
      }));
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    setPaymentModalOpen(false);
    const paidRec = paymentResult?.payment || paymentResult;
    setApplicationFeePayment(paidRec);
    const updated = paymentResult?.application || application;
    setSubmittedAppInfo(updated);
    setApplication((prev) => ({
      ...prev,
      status: 'SUBMITTED',
      payments: [...(prev?.payments || []), paidRec],
    }));
    setSubmitSuccessModalOpen(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  if (loading) {
    return <Spinner size="lg" label="Loading application form..." className="py-24" />;
  }

  const isLocked = application?.status !== 'DRAFT' && application?.status !== 'FLAGGED';
  const isFlagged = application?.status === 'FLAGGED';

  return (
    <div className="space-y-6">
      {/* Browser Back Navigation Disabled Notification */}
      {browserBackWarning && (
        <div className="bg-amber-50 border-2 border-amber-400 text-amber-900 px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">
              Browser back button navigation is disabled on this admission application form to safeguard your data. Please use the in-form Step and Back buttons below.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setBrowserBackWarning(false)}
            className="text-amber-800 hover:text-amber-950 font-bold text-xs shrink-0 px-2 py-1 rounded hover:bg-amber-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Flagged for Candidate Correction Notification Banner */}
      {isFlagged && (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 p-5 rounded-2xl shadow-sm space-y-2.5">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <h2 className="text-base font-black text-amber-950 uppercase tracking-wide">
              Action Required: Application Flagged for Candidate Correction
            </h2>
            <span className="text-[11px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
              Form & Documents Unlocked
            </span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            The Admissions Committee has flagged your application for corrections or updated document scans. Please navigate through the steps to update your particulars or re-upload your documents. When finished, proceed to <strong>Step 6: Review & Final Submission</strong> and click <strong>Resubmit Application</strong>.
          </p>
          {application?.decision?.rejection_reason && (
            <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Admissions Committee Reviewer Instructions:</span>
              <span className="text-slate-800 italic font-medium">"{application.decision.rejection_reason}"</span>
            </div>
          )}
        </div>
      )}

      {/* Header with App ID and Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded">
              {application?.application_id}
            </span>
            <Badge variant={application?.status}>{application?.status?.replace('_', ' ')}</Badge>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {application?.department?.name} ({application?.department?.degree})
          </h1>
        </div>

        {isLocked && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Application submitted. Information is locked for review.</span>
          </div>
        )}

        {isFlagged && (
          <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-100/70 px-3 py-2 rounded-lg border border-amber-300 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Correction Mode: Unlocked for Editing</span>
          </div>
        )}
      </div>

      {/* Stepper Navigation */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
      </div>

      {error && (
        <Alert type="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert type="success" onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      {/* STEP 1: PERSONAL INFORMATION */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <User className="w-5 h-5 text-iem-blue" />
            <h2 className="text-lg font-bold text-slate-900">Step 1: Personal Details</h2>
          </div>

          <form onSubmit={handleSavePersonal} className="space-y-6">
            {/* Name Section with Capitalized First Letter & No Numbers Constraint */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Candidate Legal Name <span className="text-rose-500">*</span>
                </span>
                <span className="text-[10px] font-bold text-iem-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  FIRST LETTER CAPITAL • NUMBERS PROHIBITED
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="First Name"
                    required
                    disabled={isLocked}
                    placeholder="e.g. Subhas or SUBHAS"
                    helperText="First letter capital; no numbers allowed"
                    value={personal.first_name}
                    error={validationErrors.first_name}
                    onChange={(e) => {
                      handleCapitalizedNameChange('first_name', e.target.value, setPersonal, personal);
                    }}
                  />
                  <UniformWarning message={validationErrors.first_name} />
                </div>

                <div>
                  <Input
                    label="Middle Name"
                    disabled={isLocked}
                    placeholder="e.g. Chandra"
                    helperText="First letter capital; no numbers allowed"
                    value={personal.middle_name || ''}
                    error={validationErrors.middle_name}
                    onChange={(e) => {
                      handleCapitalizedNameChange('middle_name', e.target.value, setPersonal, personal);
                    }}
                  />
                  <UniformWarning message={validationErrors.middle_name} />
                </div>

                <div>
                  <Input
                    label="Last Name"
                    required
                    disabled={isLocked}
                    placeholder="e.g. Bose or BOSE"
                    helperText="First letter capital; no numbers allowed"
                    value={personal.last_name}
                    error={validationErrors.last_name}
                    onChange={(e) => {
                      handleCapitalizedNameChange('last_name', e.target.value, setPersonal, personal);
                    }}
                  />
                  <UniformWarning message={validationErrors.last_name} />
                </div>
              </div>
            </div>

            {/* Date of Birth (Age 16-30 Interval) and Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Date of Birth"
                  type="date"
                  required
                  disabled={isLocked}
                  max={maxDobDate}
                  min={minDobDate}
                  value={personal.date_of_birth}
                  error={validationErrors.date_of_birth}
                  onChange={(e) => {
                    const newDob = e.target.value;
                    setPersonal({ ...personal, date_of_birth: newDob });
                    if (validationErrors.date_of_birth) {
                      setValidationErrors({ ...validationErrors, date_of_birth: null });
                    }
                  }}
                />
                {personal.date_of_birth && (() => {
                  const calculatedAge = getCalculatedAge(personal.date_of_birth);
                  if (calculatedAge === null || calculatedAge < 0) {
                    return (
                      <UniformWarning message="Date of birth cannot be in the future (age cannot be negative)." />
                    );
                  }
                  if (calculatedAge < 16 || calculatedAge > 30) {
                    return (
                      <UniformWarning message={`Age must be between 16 and 30 years. Current calculated age: ${calculatedAge} years.`} />
                    );
                  }
                  return (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">Calculated Age: {calculatedAge} Years (Eligible: 16–30 years)</span>
                    </div>
                  );
                })()}
                {validationErrors.date_of_birth && !personal.date_of_birth && (
                  <UniformWarning message={validationErrors.date_of_birth} />
                )}
              </div>

              <Select
                label="Gender"
                required
                disabled={isLocked}
                value={personal.gender}
                onChange={(e) => setPersonal({ ...personal, gender: e.target.value })}
                options={[
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'OTHER', label: 'Other' },
                ]}
              />

              <Select
                label="Reservation Category"
                disabled={isLocked}
                value={personal.category}
                onChange={(e) => setPersonal({ ...personal, category: e.target.value })}
                options={[
                  { value: 'GENERAL', label: 'General / Open' },
                  { value: 'OBC', label: 'OBC' },
                  { value: 'SC', label: 'SC' },
                  { value: 'ST', label: 'ST' },
                  { value: 'EWS', label: 'EWS' },
                ]}
              />
            </div>

            {/* Blood Group & Rh Factor Compulsory Section with Rh Factor Sub-section */}
            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    Blood Group & Rh Factor <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Compulsory medical verification record. Please select both Blood Group and Rh Factor sub-section.
                  </p>
                </div>
                {bloodType && rhFactor && (
                  <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Selected: {bloodType}{rhFactor} ({bloodType} {rhFactor === '+' ? 'Positive' : 'Negative'})</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* 1. Blood Group Type (A, B, AB, O) */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    1. Blood Group Type <span className="text-rose-500">*</span>
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {['A', 'B', 'AB', 'O'].map((type) => (
                      <button
                        type="button"
                        key={type}
                        disabled={isLocked}
                        onClick={() => handleBloodGroupChange(type, rhFactor)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          bloodType === type
                            ? 'bg-iem-blue text-white border-iem-blue shadow-xs ring-2 ring-blue-100'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Rh Factor Sub-section (+ / -) */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    2. Rh Factor Sub-Section <span className="text-rose-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: '+', label: 'Rh+ (Positive)' },
                      { key: '-', label: 'Rh- (Negative)' },
                    ].map((rh) => (
                      <button
                        type="button"
                        key={rh.key}
                        disabled={isLocked}
                        onClick={() => handleBloodGroupChange(bloodType, rh.key)}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          rhFactor === rh.key
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-100'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {rh.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {validationErrors.blood_group && (
                <UniformWarning message={validationErrors.blood_group} />
              )}
            </div>

            {/* Nationality & Aadhaar Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nationality"
                disabled={isLocked}
                value={personal.nationality}
                onChange={(e) => setPersonal({ ...personal, nationality: e.target.value })}
              />
              <div>
                <Input
                  label="Aadhaar Card Number (12 Digits)"
                  placeholder="12 digit numeric Aadhaar"
                  maxLength={14}
                  disabled={isLocked}
                  value={personal.aadhar_number || ''}
                  error={validationErrors.aadhar_number}
                  helperText="12-digit Government UIDAI identification"
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9\s]/g, '');
                    setPersonal({ ...personal, aadhar_number: val });
                    if (validationErrors.aadhar_number) setValidationErrors({ ...validationErrors, aadhar_number: null });
                  }}
                />
                {personal.aadhar_number &&
                  personal.aadhar_number.replace(/\s+/g, '').length > 0 &&
                  personal.aadhar_number.replace(/\s+/g, '').length !== 12 && (
                    <UniformWarning message={`Aadhaar must be exactly 12 digits (currently ${personal.aadhar_number.replace(/\s+/g, '').length} digits).`} />
                  )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isLocked}
                isLoading={saving}
                className="font-bold"
              >
                Save & Continue to Contact Details <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* STEP 2: CONTACT INFORMATION */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-iem-blue" />
            <h2 className="text-lg font-bold text-slate-900">Step 2: Contact & Address Details</h2>
          </div>

          <form onSubmit={handleSaveContact} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Primary Email Address"
                type="email"
                required
                disabled={isLocked}
                value={contact.email}
                error={validationErrors.email}
                onChange={(e) => {
                  setContact({ ...contact, email: e.target.value });
                  if (validationErrors.email) setValidationErrors({ ...validationErrors, email: null });
                }}
              />
              <div>
                <Input
                  label="Primary Phone Number (+91)"
                  required
                  disabled={isLocked}
                  value={contact.phone}
                  placeholder="9876543210"
                  error={validationErrors.phone}
                  helperText="10-digit mobile number"
                  onChange={(e) => {
                    setContact({ ...contact, phone: e.target.value });
                    if (validationErrors.phone) setValidationErrors({ ...validationErrors, phone: null });
                  }}
                />
                {contact.phone && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(contact.phone.trim()) && (
                  <UniformWarning message="Must be a valid 10-digit Indian mobile number." />
                )}
              </div>

              <div>
                <Input
                  label="Alternate Contact Number"
                  disabled={isLocked}
                  placeholder="Optional 10-digit number"
                  value={contact.alternate_phone || ''}
                  error={validationErrors.alternate_phone}
                  onChange={(e) => {
                    setContact({ ...contact, alternate_phone: e.target.value });
                    if (validationErrors.alternate_phone) setValidationErrors({ ...validationErrors, alternate_phone: null });
                  }}
                />
                {contact.alternate_phone && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(contact.alternate_phone.trim()) && (
                  <UniformWarning message="Must be 10 digits if provided." />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Permanent Address Line 1"
                  required
                  disabled={isLocked}
                  placeholder="House/Plot/Building No., Street, Area (no negative numbers)"
                  helperText="Positive numbers only (e.g. Flat 4B, Sector 5)"
                  value={contact.address_line1}
                  error={validationErrors.address_line1}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const hasNeg = /(?:^|\s|#|;|,|\/)-[0-9]+/.test(raw) || /-[0-9]+/.test(raw);
                    setContact({ ...contact, address_line1: raw });
                    if (hasNeg) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        address_line1: 'Warning: Address cannot contain negative numbers (e.g. -1, -5). Please enter positive building/plot/street numbers.',
                      }));
                    } else if (validationErrors.address_line1) {
                      setValidationErrors((prev) => ({ ...prev, address_line1: null }));
                    }
                  }}
                />
                <UniformWarning message={validationErrors.address_line1} />
              </div>

              <div>
                <Input
                  label="Address Line 2 (Optional)"
                  disabled={isLocked}
                  placeholder="Landmark, Apartment, Block"
                  helperText="Positive numbers only (no negative numbers)"
                  value={contact.address_line2 || ''}
                  error={validationErrors.address_line2}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const hasNeg = /(?:^|\s|#|;|,|\/)-[0-9]+/.test(raw) || /-[0-9]+/.test(raw);
                    setContact({ ...contact, address_line2: raw });
                    if (hasNeg) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        address_line2: 'Warning: Address Line 2 cannot contain negative numbers.',
                      }));
                    } else if (validationErrors.address_line2) {
                      setValidationErrors((prev) => ({ ...prev, address_line2: null }));
                    }
                  }}
                />
                <UniformWarning message={validationErrors.address_line2} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <IndianStateDropdown
                required
                disabled={isLocked}
                value={contact.state}
                error={validationErrors.state}
                onChange={(selectedState) => {
                  setContact((prev) => ({
                    ...prev,
                    state: selectedState,
                    city: prev.city ? prev.city : '',
                  }));
                  if (validationErrors.state) {
                    setValidationErrors((prev) => ({ ...prev, state: null }));
                  }
                }}
              />

              <IndianCityDropdown
                required
                disabled={isLocked}
                state={contact.state}
                value={contact.city}
                error={validationErrors.city}
                onChange={(selectedCity) => {
                  setContact((prev) => ({ ...prev, city: selectedCity }));
                  if (validationErrors.city) {
                    setValidationErrors((prev) => ({ ...prev, city: null }));
                  }
                }}
              />

              <div>
                <Input
                  label="Pincode (6 Digits)"
                  required
                  maxLength={6}
                  disabled={isLocked}
                  value={contact.pincode}
                  placeholder="e.g. 700091"
                  helperText="Positive 6-digit PIN code"
                  error={validationErrors.pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                    setContact({ ...contact, pincode: val });
                    if (validationErrors.pincode) setValidationErrors({ ...validationErrors, pincode: null });
                  }}
                />
                {contact.pincode && contact.pincode.startsWith('0') && (
                  <UniformWarning message="Pincode cannot start with 0 in India." />
                )}
                {contact.pincode && contact.pincode.length > 0 && contact.pincode.length !== 6 && (
                  <UniformWarning message="Pincode must be exactly 6 numeric digits (e.g. 700091)." />
                )}
              </div>

              <Input
                label="Country"
                disabled
                value={contact.country || 'India'}
                helperText="Centralized India Admission"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLocked}
                isLoading={saving}
                className="font-bold"
              >
                Save & Continue to Guardian Info <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* STEP 3: GUARDIAN INFORMATION */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <Users className="w-5 h-5 text-iem-blue" />
            <h2 className="text-lg font-bold text-slate-900">Step 3: Guardian Details</h2>
          </div>

          <form onSubmit={handleSaveGuardian} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Father's Full Name"
                  required
                  disabled={isLocked}
                  placeholder="e.g. Amitava Bose"
                  helperText="First letter capital; no numbers allowed"
                  value={guardian.father_name}
                  error={validationErrors.father_name}
                  onChange={(e) => {
                    handleCapitalizedNameChange('father_name', e.target.value, setGuardian, guardian);
                  }}
                />
                <UniformWarning message={validationErrors.father_name} />
              </div>
              <Input
                label="Father's Occupation"
                disabled={isLocked}
                value={guardian.father_occupation || ''}
                onChange={(e) => setGuardian({ ...guardian, father_occupation: e.target.value })}
              />
              <div>
                <Input
                  label="Father's Phone Number (+91)"
                  disabled={isLocked}
                  placeholder="Optional 10-digit mobile"
                  value={guardian.father_phone || ''}
                  error={validationErrors.father_phone}
                  onChange={(e) => {
                    setGuardian({ ...guardian, father_phone: e.target.value });
                    if (validationErrors.father_phone) setValidationErrors({ ...validationErrors, father_phone: null });
                  }}
                />
                {guardian.father_phone && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(guardian.father_phone.trim()) && (
                  <UniformWarning message="Must be a valid 10-digit number if entered." />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Mother's Full Name"
                  required
                  disabled={isLocked}
                  placeholder="e.g. Prabhavati Bose"
                  helperText="First letter capital; no numbers allowed"
                  value={guardian.mother_name}
                  error={validationErrors.mother_name}
                  onChange={(e) => {
                    handleCapitalizedNameChange('mother_name', e.target.value, setGuardian, guardian);
                  }}
                />
                <UniformWarning message={validationErrors.mother_name} />
              </div>
              <Input
                label="Mother's Occupation"
                disabled={isLocked}
                value={guardian.mother_occupation || ''}
                onChange={(e) => setGuardian({ ...guardian, mother_occupation: e.target.value })}
              />
              <div>
                <Input
                  label="Mother's Phone Number (+91)"
                  disabled={isLocked}
                  placeholder="Optional 10-digit mobile"
                  value={guardian.mother_phone || ''}
                  error={validationErrors.mother_phone}
                  onChange={(e) => {
                    setGuardian({ ...guardian, mother_phone: e.target.value });
                    if (validationErrors.mother_phone) setValidationErrors({ ...validationErrors, mother_phone: null });
                  }}
                />
                {guardian.mother_phone && !/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(guardian.mother_phone.trim()) && (
                  <UniformWarning message="Must be a valid 10-digit number if entered." />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Annual Family Income"
                disabled={isLocked}
                value={guardian.annual_income}
                onChange={(e) => setGuardian({ ...guardian, annual_income: e.target.value })}
                options={[
                  { value: 'Below 2.5 Lakhs', label: 'Below ₹2.5 Lakhs' },
                  { value: '2.5 - 5 Lakhs', label: '₹2.5 Lakhs – ₹5 Lakhs' },
                  { value: '5-10 Lakhs', label: '₹5 Lakhs – ₹10 Lakhs' },
                  { value: 'Above 10 Lakhs', label: 'Above ₹10 Lakhs' },
                ]}
              />
              <div>
                <Input
                  label="Local Guardian (if applicable)"
                  disabled={isLocked}
                  placeholder="e.g. Anil Kumar Bose"
                  helperText="First letter capital; no numbers allowed"
                  value={guardian.guardian_name || ''}
                  error={validationErrors.guardian_name}
                  onChange={(e) => {
                    handleCapitalizedNameChange('guardian_name', e.target.value, setGuardian, guardian);
                  }}
                />
                <UniformWarning message={validationErrors.guardian_name} />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLocked}
                isLoading={saving}
                className="font-bold"
              >
                Save & Continue to Academic Records <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* STEP 4: ACADEMIC RECORDS */}
      {currentStep === 4 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-iem-blue" />
            <h2 className="text-lg font-bold text-slate-900">Step 4: Academic Records & Exam Scores</h2>
          </div>

          <form onSubmit={handleSaveAcademic} className="space-y-6">
            {/* 10th Record */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Class 10th (Secondary) Records
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Input
                  label="10th Board"
                  required
                  placeholder="CBSE / ICSE / WBBSE"
                  disabled={isLocked}
                  value={academic.tenth_board}
                  onChange={(e) => setAcademic({ ...academic, tenth_board: e.target.value })}
                />
                <Input
                  label="School Name"
                  required
                  disabled={isLocked}
                  value={academic.tenth_school}
                  error={validationErrors.tenth_school}
                  onChange={(e) => {
                    setAcademic({ ...academic, tenth_school: e.target.value });
                    if (validationErrors.tenth_school) setValidationErrors({ ...validationErrors, tenth_school: null });
                  }}
                />
                <Input
                  label="Passing Year"
                  type="number"
                  required
                  disabled={isLocked}
                  value={academic.tenth_year}
                  onChange={(e) => setAcademic({ ...academic, tenth_year: e.target.value })}
                />
                <div>
                  <Input
                    label="Percentage (%)"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 88.5"
                    disabled={isLocked}
                    value={academic.tenth_percentage}
                    error={validationErrors.tenth_percentage}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAcademic({ ...academic, tenth_percentage: val });
                      if (val !== '') {
                        const num = parseFloat(val);
                        if (val.includes('-') || num < 0) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            tenth_percentage: '10th percentage must be a positive number (cannot be negative).',
                          }));
                        } else if (num > 100) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            tenth_percentage: '10th percentage cannot exceed 100%.',
                          }));
                        } else if (num < 50) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            tenth_percentage: `Minimum requirement not fulfilled: Minimum 50% required in Class 10th (Current: ${num}%).`,
                          }));
                        } else {
                          setValidationErrors((prev) => ({ ...prev, tenth_percentage: null }));
                        }
                      } else {
                        setValidationErrors((prev) => ({ ...prev, tenth_percentage: null }));
                      }
                    }}
                    helperText={
                      academic.tenth_percentage !== '' &&
                      !isNaN(parseFloat(academic.tenth_percentage)) &&
                      parseFloat(academic.tenth_percentage) >= 50 &&
                      parseFloat(academic.tenth_percentage) <= 100
                        ? '✓ Meets minimum requirement (≥50%)'
                        : 'Positive number • Min 50% required'
                    }
                  />
                  <UniformWarning message={validationErrors.tenth_percentage} />
                </div>
              </div>
            </div>

            {/* 12th Record */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Class 12th (Higher Secondary) / Diploma Records
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Input
                  label="12th Board"
                  required
                  placeholder="CBSE / ISC / WBCHSE"
                  disabled={isLocked}
                  value={academic.twelfth_board}
                  onChange={(e) => setAcademic({ ...academic, twelfth_board: e.target.value })}
                />
                <Input
                  label="College / School"
                  required
                  disabled={isLocked}
                  value={academic.twelfth_school}
                  error={validationErrors.twelfth_school}
                  onChange={(e) => {
                    setAcademic({ ...academic, twelfth_school: e.target.value });
                    if (validationErrors.twelfth_school) setValidationErrors({ ...validationErrors, twelfth_school: null });
                  }}
                />
                <Input
                  label="Passing Year"
                  type="number"
                  required
                  disabled={isLocked}
                  value={academic.twelfth_year}
                  onChange={(e) => setAcademic({ ...academic, twelfth_year: e.target.value })}
                />
                <div>
                  <Input
                    label="Overall %"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    placeholder="e.g. 86.4"
                    disabled={isLocked}
                    value={academic.twelfth_percentage}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAcademic({ ...academic, twelfth_percentage: val });
                      if (val !== '') {
                        const num = parseFloat(val);
                        if (val.includes('-') || num < 0) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            twelfth_percentage: '12th percentage must be a positive number (cannot be negative).',
                          }));
                        } else if (num > 100) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            twelfth_percentage: '12th percentage cannot exceed 100%.',
                          }));
                        } else if (num < 60) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            twelfth_percentage: `Minimum requirement not fulfilled: Minimum 60% aggregate required for admission (Current: ${num}%).`,
                          }));
                        } else {
                          setValidationErrors((prev) => ({ ...prev, twelfth_percentage: null }));
                        }
                      } else {
                        setValidationErrors((prev) => ({ ...prev, twelfth_percentage: null }));
                      }
                    }}
                    error={validationErrors.twelfth_percentage}
                    helperText={
                      academic.twelfth_percentage !== '' &&
                      !isNaN(parseFloat(academic.twelfth_percentage)) &&
                      parseFloat(academic.twelfth_percentage) >= 60 &&
                      parseFloat(academic.twelfth_percentage) <= 100
                        ? '✓ Meets minimum 60% cutoff'
                        : 'Positive number • Min 60% required for admission'
                    }
                  />
                  <UniformWarning message={validationErrors.twelfth_percentage} />
                </div>
              </div>
            </div>

            {/* Entrance Examination */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Competitive Entrance Examination
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Entrance Exam Name"
                  disabled={isLocked}
                  value={academic.entrance_exam_name}
                  onChange={(e) => setAcademic({ ...academic, entrance_exam_name: e.target.value })}
                  options={[
                    { value: 'WBJEE', label: 'WBJEE (West Bengal Joint Entrance Examination)' },
                    { value: 'JEE Main', label: 'JEE Main' },
                    { value: 'IEMJEE', label: 'IEMJEE (Institutional Entrance Examination)' },
                  ]}
                />
                <Input
                  label="Roll / Admit Card Number"
                  disabled={isLocked}
                  value={academic.entrance_roll_number || ''}
                  onChange={(e) => setAcademic({ ...academic, entrance_roll_number: e.target.value })}
                />
                <div>
                  <Input
                    label="General Merit Rank (GMR)"
                    type="number"
                    min="1"
                    max="1000000"
                    placeholder="e.g. 4500"
                    disabled={isLocked}
                    value={academic.entrance_rank || ''}
                    error={validationErrors.entrance_rank}
                    helperText={
                      academic.entrance_rank !== '' &&
                      !isNaN(Number(academic.entrance_rank)) &&
                      Number(academic.entrance_rank) > 0 &&
                      Number(academic.entrance_rank) <= 1000000
                        ? `✓ Valid rank: ${Number(academic.entrance_rank).toLocaleString('en-IN')}`
                        : 'Must be positive and below 10 Lakhs (1 to 10,00,000)'
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setAcademic({ ...academic, entrance_rank: val });
                      if (val !== '') {
                        const num = Number(val);
                        if (val.includes('-') || isNaN(num) || num <= 0) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            entrance_rank: 'General Merit Rank (GMR) must be a positive number (cannot be negative or zero).',
                          }));
                        } else if (num > 1000000) {
                          setValidationErrors((prev) => ({
                            ...prev,
                            entrance_rank: `General Merit Rank (GMR) must be below 10 Lakhs (maximum 10,00,000). Current: ${num.toLocaleString('en-IN')}.`,
                          }));
                        } else {
                          setValidationErrors((prev) => ({ ...prev, entrance_rank: null }));
                        }
                      } else {
                        setValidationErrors((prev) => ({ ...prev, entrance_rank: null }));
                      }
                    }}
                  />
                  <UniformWarning message={validationErrors.entrance_rank} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isLocked}
                isLoading={saving}
                className="font-bold"
              >
                Save & Continue to Documents <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* STEP 5: DOCUMENT UPLOADS */}
      {currentStep === 5 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <Upload className="w-5 h-5 text-iem-blue" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 5: Document Scans & Proofs</h2>
              <p className="text-xs text-slate-500">Allowed formats: PDF, JPG, PNG (Max size: 5MB per file)</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {DOCUMENT_TYPES.map((dt) => {
              const uploadedDoc = documents.find((d) => d.document_type === dt.id);
              const isUploading = uploadingType === dt.id;

              return (
                <div
                  key={dt.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    uploadedDoc
                      ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {uploadedDoc ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <Upload className="w-6 h-6 text-slate-400 shrink-0" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{dt.label}</span>
                        {dt.required && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            Required
                          </span>
                        )}
                        {uploadedDoc && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                            ✓ Verified Upload
                          </span>
                        )}
                      </div>
                      {uploadedDoc ? (
                        <p className="text-[11px] text-emerald-800 mt-1">
                          File: <span className="font-semibold">{uploadedDoc.original_name}</span> ({(uploadedDoc.size / 1024).toFixed(0)} KB) • <span className="text-amber-800 font-medium">Incorrect document? Click "Re-upload / Replace" to submit corrected scan.</span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-500 mt-0.5">Not yet uploaded (Scanned PDF, JPG, PNG)</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {uploadedDoc ? (
                      <>
                        <a
                          href={documentService.getDocumentUrl(uploadedDoc.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </a>

                        {!isLocked && (
                          <>
                            {/* Re-upload / Replace Facility for Incorrect Documents */}
                            <label className={`${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                              <input
                                type="file"
                                accept={dt.accept}
                                disabled={isUploading || isLocked}
                                onChange={(e) => handleFileUpload(dt.id, e.target.files[0])}
                                className="hidden"
                              />
                              <span className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg shadow-2xs inline-flex items-center gap-1.5 transition-colors">
                                {isUploading ? <Spinner size="sm" /> : <RefreshCw className="w-3.5 h-3.5 text-amber-600" />}
                                <span>Re-upload / Replace</span>
                              </span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleDeleteDoc(uploadedDoc.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
                              title="Delete file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </>
                    ) : !isLocked ? (
                      <div className="flex items-center gap-2">
                        <label className={`${isUploading || isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                          <input
                            type="file"
                            accept={dt.accept}
                            disabled={isUploading || isLocked}
                            onChange={(e) => handleFileUpload(dt.id, e.target.files[0])}
                            className="hidden"
                          />
                          <span className="px-3.5 py-1.5 text-xs font-bold text-white bg-iem-blue hover:bg-iem-blue-dark rounded-lg shadow-sm inline-flex items-center gap-1.5">
                            {isUploading ? <Spinner size="sm" /> : <Upload className="w-3.5 h-3.5" />}
                            <span>Upload</span>
                          </span>
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(4)}>
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
            <Button variant="primary" onClick={() => setCurrentStep(6)} className="font-bold">
              Review Full Application <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 6 & 7: REVIEW SUMMARY & FINAL SUBMIT */}
      {currentStep >= 6 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-iem-blue" />
              <h2 className="text-lg font-bold text-slate-900">Step 6: Review & Final Submission</h2>
            </div>
            {!isLocked && (
              <span className="text-xs font-semibold text-slate-500">
                Please verify all records before final submission
              </span>
            )}
          </div>

          {/* Section 1: Personal Summary */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Personal Details
              </h3>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-iem-blue hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Full Name:</span>
                <span className="font-bold text-slate-900">
                  {personal.first_name} {personal.middle_name} {personal.last_name}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">DOB & Age:</span>
                <span className="font-bold text-slate-900">
                  {personal.date_of_birth} ({getCalculatedAge(personal.date_of_birth)} Yrs)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Blood Group (Rh):</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                  {personal.blood_group || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Gender / Category:</span>
                <span className="font-bold text-slate-900">{personal.gender} • {personal.category}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Summary */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Contact & Address
              </h3>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-iem-blue hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Email:</span>
                <span className="font-bold text-slate-900">{contact.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Phone:</span>
                <span className="font-bold text-slate-900">{contact.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">Address:</span>
                <span className="font-bold text-slate-900">
                  {contact.address_line1}, {contact.city}, {contact.state} - {contact.pincode}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Guardian Summary */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Guardian Information
              </h3>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-iem-blue hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Father's Name:</span>
                <span className="font-bold text-slate-900">{guardian.father_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mother's Name:</span>
                <span className="font-bold text-slate-900">{guardian.mother_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Family Income:</span>
                <span className="font-bold text-slate-900">{guardian.annual_income}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Academic Summary */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                4. Academic History
              </h3>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs font-bold text-iem-blue hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">10th Board & %:</span>
                <span className="font-bold text-slate-900">
                  {academic.tenth_board} ({academic.tenth_percentage}%)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">12th Board & %:</span>
                <span className="font-bold text-slate-900">
                  {academic.twelfth_board} ({academic.twelfth_percentage}%)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Entrance Exam:</span>
                <span className="font-bold text-slate-900">
                  {academic.entrance_exam_name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Rank:</span>
                <span className="font-bold text-slate-900">
                  {academic.entrance_rank || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 5: Uploaded Documents Summary */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5. Uploaded Document Records ({documents.length})
              </h3>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="text-xs font-bold text-iem-blue hover:underline"
                >
                  Manage
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <span className="font-medium text-slate-800">{doc.document_type.replace('_', ' ')}</span>
                  <a
                    href={documentService.getDocumentUrl(doc.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-iem-blue font-bold hover:underline"
                  >
                    View Scan
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Application Fee Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                7. Application Form Filling Fee
              </span>
              {applicationFeePayment ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ₹500.00 Paid
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ₹500.00 Required
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-iem-blue flex items-center justify-center shrink-0 border border-blue-200">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Centralized Admission Registration Fee</h4>
                  <p className="text-xs text-slate-500">
                    Mandatory fee of ₹500 for candidate document verification & seat allocation processing.
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 shrink-0">
                <span className="text-[11px] text-slate-400 block font-semibold uppercase">Fee Amount</span>
                <span className="text-lg font-black text-iem-navy font-mono">₹500.00</span>
                {applicationFeePayment && (
                  <span className="text-[10px] text-slate-500 font-mono block">
                    Txn: {applicationFeePayment.transaction_id}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Accuracy Declaration & Submit Bar */}
          {!isLocked ? (
            <div className="pt-6 border-t border-slate-200 space-y-6">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declarationChecked}
                  onChange={(e) => setDeclarationChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 text-iem-blue rounded focus:ring-iem-blue"
                />
                <span className="text-xs text-slate-700 leading-relaxed font-medium">
                  I hereby solemnly declare that all particulars stated in this application form and the uploaded credentials are true, complete, and authentic to the best of my knowledge. I understand that any false information will result in immediate disqualification of admission.
                </span>
              </label>

              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setCurrentStep(5)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Documents
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  disabled={!declarationChecked}
                  onClick={() => {
                    const hasPhoto = documents.some((d) => d.document_type === 'photograph');
                    const hasId = documents.some((d) => d.document_type === 'id_proof');
                    const hasMarksheet = documents.some((d) => d.document_type === 'marksheet_10th' || d.document_type === 'marksheet_12th');
                    if (!hasPhoto || !hasId || !hasMarksheet) {
                      setError('Cannot submit incomplete application. Please ensure Photograph, ID Proof, and Marksheets are uploaded.');
                      setCurrentStep(5);
                      return;
                    }
                    if (!applicationFeePayment) {
                      setPaymentModalOpen(true);
                    } else {
                      setConfirmSubmitOpen(true);
                    }
                  }}
                  className="font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700"
                >
                  {applicationFeePayment ? (
                    <>
                      <Send className="w-4 h-4 mr-2" /> {isFlagged ? 'Resubmit Corrected Application' : 'Final Submit Application'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" /> Pay Application Fee (₹500) & Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-6 border-t border-slate-200 flex justify-between">
              <Link to="/applicant/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Dashboard
                </Button>
              </Link>

              <Link to={`/applicant/applications/${id}/acknowledgement`}>
                <Button variant="primary" className="font-bold">
                  View Acknowledgement Slip <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          )}
        </Card>
      )}

      {/* Confirmation Dialog Before Final Submit */}
      <Modal
        isOpen={confirmSubmitOpen}
        onClose={() => setConfirmSubmitOpen(false)}
        title={isFlagged ? "Confirm Application Resubmission" : "Confirm Final Application Submission"}
        subtitle="Please confirm before submitting to the IEM Admissions Committee"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Important Submission Notice:</span>
              Once submitted, your updated particulars and documents will be sent to the Admissions Committee for final review.
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setConfirmSubmitOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={saving}
              onClick={handleFinalSubmit}
              className="font-bold bg-emerald-600 hover:bg-emerald-700"
            >
              {isFlagged ? 'Yes, Resubmit Application' : 'Yes, Submit Application'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Submission Confirmation Success Modal */}
      <Modal
        isOpen={submitSuccessModalOpen}
        onClose={() => {}}
        title="Application Submitted Successfully!"
        subtitle="Official admission acknowledgement confirmation"
      >
        <div className="space-y-6 text-center py-2">
          {/* Celebration Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-slate-900">
              Application Successfully Submitted!
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Your admission application has been successfully lodged with the Central Admissions Committee. A formal confirmation and Acknowledgement Slip have been generated.
            </p>
          </div>

          {/* Key Application Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Unique Application ID:</span>
              <span className="text-sm font-black font-mono text-iem-navy bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {submittedAppInfo?.application_id || application?.application_id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Candidate Name:</span>
                <span className="font-bold text-slate-800">
                  {personal.first_name} {personal.last_name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Department:</span>
                <span className="font-bold text-slate-800">
                  {application?.department?.name || 'Engineering'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Degree:</span>
                <span className="font-bold text-slate-800">
                  {application?.department?.degree} ({application?.department?.code})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Blood Group (Rh):</span>
                <span className="font-bold text-rose-700">
                  {personal.blood_group}
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 font-semibold text-[11px]">Application Fee (₹500):</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PAID • {submittedAppInfo?.payments?.find(p => p.payment_type === 'APPLICATION_FEE')?.transaction_id || applicationFeePayment?.transaction_id || 'TXN-SUCCESS'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/applicant/applications/${id}/acknowledgement`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-md bg-emerald-600 hover:bg-emerald-700"
              >
                <FileText className="w-4 h-4 mr-1.5" /> View Acknowledgement Slip
              </Button>
            </Link>

            <Link
              to="/applicant/dashboard"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="md" className="w-full font-bold">
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

      {/* Interactive Payment Gateway Modal for Application Form Fee (₹500) */}
      <PaymentGatewayModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        applicationId={id}
        applicationCode={application?.application_id}
        candidateName={`${personal.first_name} ${personal.last_name}`.trim()}
        paymentType="APPLICATION_FEE"
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ApplicationForm;
