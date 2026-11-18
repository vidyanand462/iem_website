import Department from '../models/department.model.js';
import ApplicationDeadline from '../models/deadline.model.js';

export class PublicService {
  /**
   * Get public programs list
   */
  static async getPrograms() {
    return Department.findAll({
      where: { is_active: true },
      order: [['id', 'ASC']],
    });
  }

  /**
   * Get verified institutional stats & placeholders
   */
  static async getStats() {
    return {
      yearsOfExcellence: '37+',
      foundingYear: 1989,
      activeStudents: '[CONTENT TO BE VERIFIED]',
      patentsPublications: '[CONTENT TO BE VERIFIED]',
      internationalMous: '[CONTENT TO BE VERIFIED]',
      naacAccreditation: 'Autonomous Institute - Institutional Quality Audit with Grade A+',
      location: 'Salt Lake Electronics Complex, Kolkata',
    };
  }

  /**
   * Get public news and events
   */
  static async getNews() {
    return [
      {
        id: 1,
        title: 'Admissions Open for B.Tech & Management Programs (2026-2027 Cycle)',
        category: 'Admissions',
        date: '2026-02-15',
        summary: 'Applications are now open for prospective students via the IEM Centralized Admission Portal. Early application is advised.',
        tag: 'Important',
      },
      {
        id: 2,
        title: 'Annual International Conference on Computing and Communication Systems',
        category: 'Research',
        date: '2026-03-20',
        summary: 'Flagship IEEE co-sponsored international conference bringing together global researchers, industry innovators, and student scholars.',
        tag: 'Conference',
      },
      {
        id: 3,
        title: 'Innovacion 2026 - Annual Techno-Management Fest Announced',
        category: 'Campus Life',
        date: '2026-04-10',
        summary: 'Eastern Indias largest collegiate techno-management festival scheduled featuring robotics, hackathons, coding sprints, and esports.',
        tag: 'Student Fest',
      },
    ];
  }
}

export default PublicService;
