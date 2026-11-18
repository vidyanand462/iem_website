/**
 * Comprehensive Geographic Dataset for India
 * All 28 States and 8 Union Territories with Recognized Cities & Districts
 */

export const ALL_28_INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const UNION_TERRITORIES = [
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const ALL_INDIAN_STATES_AND_UTS = [
  ...ALL_28_INDIAN_STATES,
  ...UNION_TERRITORIES,
];

export const CITIES_BY_STATE = {
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry',
    'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Vizianagaram', 'Eluru',
    'Ongole', 'Nandyal', 'Machilipatnam', 'Tenali', 'Proddatur', 'Chittoor',
    'Hindupur', 'Srikakulam', 'Bhimavaram', 'Guntakal', 'Dharmavaram', 'Gudivada',
    'Narasaraopet', 'Tadepalligudem', 'Amaravati', 'Chirala', 'Madanapalle'
  ],
  'Arunachal Pradesh': [
    'Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu',
    'Roing', 'Along (Aalo)', 'Changlang', 'Khonsa', 'Namsai', 'Seppa', 'Yingkiong',
    'Anini', 'Koloriang', 'Basar', 'Longding', 'Hawai'
  ],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur',
    'Bongaigaon', 'Diphu', 'Dhubri', 'North Lakhimpur', 'Karimganj', 'Sivasagar',
    'Goalpara', 'Barpeta', 'Golaghat', 'Hailakandi', 'Lumding', 'Mangaldai',
    'Nalbari', 'Kokrajhar', 'Haflong', 'Morigaon', 'Dhemaji', 'Biswanath Chariali'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif',
    'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Danapur', 'Bettiah',
    'Saharsa', 'Hajipur', 'Sasaram', 'Dehri', 'Siwan', 'Motihari', 'Nawada',
    'Bagaha', 'Buxar', 'Kishanganj', 'Sitamarhi', 'Jamalpur', 'Jehanabad',
    'Aurangabad', 'Lakhisarai', 'Samastipur', 'Madhubani', 'Gopalganj', 'Jamui',
    'Banka', 'Supaul', 'Araria', 'Madhepura', 'Bhabua', 'Sheikhpura', 'Khagaria'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur', 'Raigarh',
    'Ambikapur', 'Durg', 'Dhamtari', 'Mahasamund', 'Kanker', 'Kawardha', 'Champa',
    'Janjgir', 'Bhatapara', 'Dalli-Rajhara', 'Kondagaon', 'Surajpur', 'Baikunthpur'
  ],
  'Goa': [
    'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem',
    'Canacona', 'Pernem', 'Quepem', 'Valpoi', 'Sanguem', 'Cuncolim', 'Sanquelim'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh',
    'Gandhinagar', 'Anand', 'Navsari', 'Morbi', 'Nadiad', 'Surendranagar', 'Bharuch',
    'Mehsana', 'Bhuj', 'Porbandar', 'Vapi', 'Valsad', 'Godhra', 'Patan', 'Palanpur',
    'Botad', 'Veraval', 'Amreli', 'Deesa', 'Jetpur', 'Dahod', 'Gondal', 'Kalol'
  ],
  'Haryana': [
    'Gurugram (Gurgaon)', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak',
    'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh',
    'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Hansi', 'Narnaul', 'Fatehabad'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali', 'Baddi', 'Nahan',
    'Hamirpur', 'Una', 'Bilaspur', 'Chamba', 'Kangra', 'Paonta Sahib', 'Sundarnagar',
    'Palampur', 'Keylong', 'Reckong Peo'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Phusro',
    'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar (Daltonganj)', 'Chaibasa',
    'Dumka', 'Sahibganj', 'Chatra', 'Godda', 'Gumla', 'Koderma', 'Pakur', 'Simdega',
    'Latehar', 'Lohardaga', 'Jhumri Telaiya', 'Chakradharpur', 'Ghatshila'
  ],
  'Karnataka': [
    'Bengaluru (Bangalore)', 'Mysuru (Mysore)', 'Hubballi-Dharwad', 'Mangaluru (Mangalore)',
    'Belagavi (Belgaum)', 'Kalaburagi (Gulbarga)', 'Davanagere', 'Ballari (Bellary)',
    'Vijayapura (Bijapur)', 'Shivamogga (Shimoga)', 'Tumakuru (Tumkur)', 'Raichur',
    'Bidar', 'Hosapete', 'Gadag', 'Hassan', 'Udupi', 'Robertsonpet', 'Bhadravati',
    'Chitradurga', 'Kolar', 'Mandya', 'Chikkamagaluru', 'Bagalkot', 'Ranebennuru'
  ],
  'Kerala': [
    'Thiruvananthapuram (Trivandrum)', 'Kochi (Cochin)', 'Kozhikode (Calicut)',
    'Kollam', 'Thrissur', 'Kannur', 'Alappuzha (Alleppey)', 'Kottayam', 'Palakkad',
    'Manjeri', 'Thalassery', 'Ponnani', 'Vatakara', 'Kanhangad', 'Payyanur',
    'Koyilandy', 'Neyyattinkara', 'Kayamkulam', 'Malappuram', 'Kasaragod',
    'Pathanamthitta', 'Idukki', 'Wayanad', 'Perinthalmanna', 'Changanassery'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna',
    'Ratlam', 'Rewa', 'Murwara (Katni)', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind',
    'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh', 'Mandsaur',
    'Khargone', 'Neemuch', 'Pithampur', 'Hoshangabad', 'Sehore', 'Betul', 'Seoni', 'Datia'
  ],
  'Maharashtra': [
    'Mumbai (Bombay)', 'Pune (Poona)', 'Nagpur', 'Thane', 'Nashik', 'Kalyan-Dombivli',
    'Vasai-Virar', 'Aurangabad (Chhatrapati Sambhaji Nagar)', 'Navi Mumbai', 'Solapur',
    'Mira-Bhayandar', 'Bhiwandi', 'Amravati', 'Nanded', 'Kolhapur', 'Akola', 'Ulhasnagar',
    'Sangli', 'Malegaon', 'Jalgaon', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur',
    'Parbhani', 'Ichalkaranji', 'Jalna', 'Ambarnath', 'Bhusawal', 'Panvel', 'Badlapur',
    'Beed', 'Gondia', 'Satara', 'Barshi', 'Yavatmal', 'Achalpur', 'Osmanabad', 'Wardha'
  ],
  'Manipur': [
    'Imphal', 'Churachandpur', 'Thoubal', 'Bishnupur', 'Ukhrul', 'Kakching',
    'Senapati', 'Tamenglong', 'Jiribam', 'Chandel', 'Kangpokpi', 'Moirang'
  ],
  'Meghalaya': [
    'Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Williamnagar', 'Baghmara',
    'Resubelpara', 'Mairang', 'Nongstoin', 'Cherrapunji (Sohra)'
  ],
  'Mizoram': [
    'Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Lawngtlai',
    'Mamit', 'Hnahthial', 'Khawzawl', 'Saitual'
  ],
  'Nagaland': [
    'Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Mon',
    'Phek', 'Kiphire', 'Longleng', 'Peren', 'Chumoukedima', 'Niuland', 'Tseminyu'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri',
    'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh',
    'Rayagada', 'Bolangir', 'Kendrapara', 'Angul', 'Dhenkanal', 'Jagatsinghpur',
    'Kendujhar (Keonjhar)', 'Paradip', 'Bhawanipatna', 'Jajpur'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)',
    'Hoshiarpur', 'Batala', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna',
    'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Firozpur', 'Kapurthala', 'Faridkot',
    'Sunam', 'Mansa', 'Gurdaspur', 'Tarn Taran', 'Nawanshahr'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar',
    'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Beawar', 'Hanumangarh', 'Tonk',
    'Kishangarh', 'Jhunjhunu', 'Baran', 'Bundi', 'Chittorgarh', 'Churu', 'Dholpur',
    'Nagaur', 'Sawai Madhopur', 'Banswara', 'Dausa', 'Jaisalmer', 'Barmer', 'Jalore'
  ],
  'Sikkim': [
    'Gangtok', 'Namchi', 'Geyzing (Gyalshing)', 'Mangan', 'Soreng', 'Pakyong',
    'Rangpo', 'Singtam', 'Jorethang', 'Ravangla'
  ],
  'Tamil Nadu': [
    'Chennai (Madras)', 'Coimbatore', 'Madurai', 'Tiruchirappalli (Trichy)', 'Salem',
    'Tiruppur', 'Erode', 'Tirunelveli', 'Vellore', 'Thoothukudi (Tuticorin)', 'Dindigul',
    'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam (Ooty)', 'Hosur',
    'Nagercoil', 'Kanchipuram', 'Kumarapalayam', 'Karaikkudi', 'Neyveli', 'Cuddalore',
    'Kumbakonam', 'Tiruvannamalai', 'Pollachi', 'Rajapalayam', 'Gudiyatham', 'Pudukkottai',
    'Vaniyambadi', 'Ambur', 'Nagapattinam', 'Namakkal', 'Dharmapuri', 'Theni'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam',
    'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Siddipet',
    'Jagtial', 'Mancherial', 'Nirmal', 'Sircilla', 'Kamareddy', 'Kothagudem',
    'Bodhan', 'Palwancha', 'Vikarabad', 'Medak', 'Sangareddy'
  ],
  'Tripura': [
    'Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Teliamura', 'Khowai',
    'Belonia', 'Melaghar', 'Ambassa', 'Sabroom', 'Bishalgarh', 'Santirbazar'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi (Banaras)',
    'Prayagraj (Allahabad)', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur',
    'Gorakhpur', 'Noida', 'Greater Noida', 'Firozabad', 'Jhansi', 'Muzaffarnagar',
    'Mathura', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Mau', 'Hapur', 'Ayodhya (Faizabad)',
    'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur',
    'Raebareli', 'Orai', 'Sitapur', 'Bahraich', 'Modinagar', 'Unnao', 'Jaunpur',
    'Lakhimpur', 'Hathras', 'Banda', 'Pilibhit', 'Barabanki', 'Basti', 'Gonda',
    'Lalitpur', 'Deoria', 'Ghazipur', 'Sultanpur', 'Azamgarh', 'Bijnor', 'Ballia'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh',
    'Nainital', 'Almora', 'Pithoragarh', 'Mussoorie', 'Kotdwar', 'Ramnagar', 'Manglaur',
    'Tehri', 'Pauri', 'Chamoli', 'Uttarkashi', 'Bageshwar', 'Champawat', 'Kichha'
  ],
  'West Bengal': [
    'Kolkata (Calcutta)', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman (Burdwan)',
    'Malda', 'Kharagpur', 'Haldia', 'Darjeeling', 'Jalpaiguri', 'Krishnanagar', 'Midnapore (Medinipur)',
    'Berhampore', 'Barasat', 'Raiganj', 'Balurghat', 'Basirhat', 'Bankura', 'Purulia',
    'Cooch Behar', 'Alipurduar', 'Kalimpong', 'Jhargram', 'Habra', 'Ranaghat', 'Bongaon',
    'Tamluk', 'Diamond Harbour', 'Bolpur', 'Rampurhat', 'Suri', 'Contai', 'Santipur',
    'Nabadwip', 'Kalyani', 'Barrackpore', 'Serampore', 'Bhatpara', 'Chandannagar'
  ],
  'Delhi (NCT)': [
    'New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi', 'Shahdara',
    'Dwarka', 'Rohini', 'Saket', 'Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Janakpuri'
  ],
  'Chandigarh': [
    'Chandigarh', 'Manimajra'
  ],
  'Jammu and Kashmir': [
    'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur', 'Sopore',
    'Rajouri', 'Poonch', 'Kupwara', 'Pulwama', 'Budgam', 'Ganderbal', 'Kulgam',
    'Bandipora', 'Doda', 'Reasi', 'Samba', 'Kishtwar', 'Ramban'
  ],
  'Ladakh': [
    'Leh', 'Kargil', 'Diskit', 'Padum', 'Nubra', 'Zanskar', 'Drass'
  ],
  'Puducherry': [
    'Puducherry (Pondicherry)', 'Karaikal', 'Mahe', 'Yanam', 'Ozhukarai'
  ],
  'Andaman and Nicobar Islands': [
    'Port Blair', 'Diglipur', 'Mayabunder', 'Rangat', 'Car Nicobar', 'Havelock (Swaraj Dweep)'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Daman', 'Diu', 'Silvassa'
  ],
  'Lakshadweep': [
    'Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy', 'Kalpeni', 'Kadmat'
  ],
};

// Flattened lookup Set of all valid Indian cities (normalized lowercase)
const normalizedCitiesMap = new Map();
const allCitiesList = [];

Object.entries(CITIES_BY_STATE).forEach(([state, cities]) => {
  cities.forEach((city) => {
    allCitiesList.push({ city, state });
    const baseLower = city.toLowerCase();
    normalizedCitiesMap.set(baseLower, { city, state });

    const match = city.match(/^(.+?)\s*\((.+?)\)$/);
    if (match) {
      const main = match[1].trim().toLowerCase();
      const alias = match[2].trim().toLowerCase();
      normalizedCitiesMap.set(main, { city, state });
      normalizedCitiesMap.set(alias, { city, state });
    }
  });
});

export const isValidIndianState = (stateName) => {
  if (!stateName || typeof stateName !== 'string') return false;
  const target = stateName.trim().toLowerCase();
  return ALL_INDIAN_STATES_AND_UTS.some((s) => s.toLowerCase() === target);
};

export const validateIndianCity = (cityName, expectedState = null) => {
  if (!cityName || typeof cityName !== 'string') {
    return { valid: false, reason: 'City name is required' };
  }

  const clean = cityName.trim();
  if (!clean || clean.length < 2) {
    return { valid: false, reason: 'City name is too short' };
  }

  if (/[0-9]/.test(clean) || /-[0-9]/.test(clean)) {
    return { valid: false, reason: 'City names cannot contain numbers or negative signs' };
  }

  const lower = clean.toLowerCase();
  const match = normalizedCitiesMap.get(lower);

  if (match) {
    if (expectedState && isValidIndianState(expectedState)) {
      const stateMatch = match.state.toLowerCase() === expectedState.trim().toLowerCase();
      return {
        valid: true,
        canonicalName: match.city,
        state: match.state,
        matchesState: stateMatch,
      };
    }
    return { valid: true, canonicalName: match.city, state: match.state, matchesState: true };
  }

  for (const [key, val] of normalizedCitiesMap.entries()) {
    if (key === lower || key.startsWith(lower) || lower.startsWith(key)) {
      return {
        valid: true,
        canonicalName: val.city,
        state: val.state,
        matchesState: !expectedState || val.state.toLowerCase() === expectedState.trim().toLowerCase(),
      };
    }
  }

  return {
    valid: false,
    reason: `"${clean}" is not a recognized Indian city or district`,
  };
};

export const getCitiesForState = (stateName) => {
  if (!stateName) return [];
  const normalized = stateName.trim().toLowerCase();
  for (const [s, cities] of Object.entries(CITIES_BY_STATE)) {
    if (s.toLowerCase() === normalized) {
      return cities;
    }
  }
  return [];
};
