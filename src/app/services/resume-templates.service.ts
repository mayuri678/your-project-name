import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeTemplatesService {
  
  getTemplateNames(): string[] {
    return [
      'professional', 'modern', 'creative', 'minimal', 'executive', 'elegant', 'tech', 'academic',
      'simple', 'bold', 'colorful', 'corporate', 'startup', 'freelance', 'consultant', 'designer',
      'developer', 'marketing', 'sales', 'finance', 'healthcare', 'education', 'legal', 'engineering',
      'architect', 'artist', 'writer', 'photographer', 'chef', 'hospitality', 'retail', 'logistics',
      'hr', 'operations', 'project', 'quality', 'research', 'data', 'cyber', 'cloud',
      'devops', 'mobile', 'game', 'ai', 'blockchain', 'iot', 'product', 'business',
      'strategy', 'entrepreneur', 'intern', 'fresher', 'experienced', 'senior', 'junior', 'manager',
      'director', 'ceo', 'cto', 'cfo', 'analyst', 'specialist', 'coordinator', 'assistant',
      'associate', 'lead', 'principal', 'architect2', 'engineer2', 'scientist', 'researcher', 'professor',
      'teacher', 'instructor', 'trainer', 'coach', 'mentor', 'advisor', 'consultant2', 'expert',
      'professional2', 'technician', 'operator', 'supervisor', 'foreman', 'worker', 'laborer', 'craftsman',
      'artisan', 'mechanic', 'electrician', 'plumber', 'carpenter', 'welder', 'painter', 'driver',
      'pilot', 'captain', 'officer', 'agent', 'representative', 'broker', 'dealer', 'trader',
      'banker', 'accountant', 'auditor', 'bookkeeper', 'clerk', 'secretary', 'receptionist', 'administrator',
      'executive2', 'manager2', 'director2', 'president', 'vp', 'chairman', 'founder', 'owner',
      'partner', 'shareholder', 'investor', 'entrepreneur2', 'businessman', 'merchant', 'vendor', 'supplier',
      'distributor', 'wholesaler', 'retailer', 'shopkeeper', 'salesman', 'cashier', 'teller', 'attendant',
      'waiter', 'bartender', 'cook', 'baker', 'butcher', 'barber', 'hairdresser', 'beautician',
      'stylist', 'makeup', 'model', 'actor', 'singer', 'musician', 'dancer', 'performer',
      'athlete', 'player', 'coach2', 'referee', 'umpire', 'judge', 'lawyer', 'attorney',
      'advocate', 'solicitor', 'barrister', 'prosecutor', 'defender', 'paralegal', 'legal2', 'compliance',
      'auditor2', 'inspector', 'investigator', 'detective', 'officer2', 'guard', 'security', 'bouncer',
      'bodyguard', 'soldier', 'marine', 'sailor', 'airman', 'veteran', 'military', 'defense',
      'police', 'firefighter', 'paramedic', 'emt', 'nurse', 'doctor', 'surgeon', 'physician',
      'dentist', 'pharmacist', 'therapist', 'counselor', 'psychologist', 'psychiatrist', 'social', 'welfare',
      'volunteer', 'activist', 'advocate2', 'organizer', 'coordinator2', 'planner', 'scheduler', 'dispatcher'
    ];
  }

  getTemplate(name: string): string {
    const templates: { [key: string]: string } = {
      professional: `<div style="text-align: center; margin-bottom: 20px;"><h1 style="margin: 0; font-size: 28px; color: #2c3e50;">YOUR NAME</h1><p style="margin: 5px 0; color: #555;">📧 email@example.com | 📱 +91 1234567890 | 📍 City, State</p></div><h2 style="border-bottom: 2px solid #2c3e50; padding-bottom: 5px; color: #2c3e50;">PROFESSIONAL SUMMARY</h2><p>Experienced professional with expertise in [your field].</p><h2 style="border-bottom: 2px solid #2c3e50; padding-bottom: 5px; color: #2c3e50; margin-top: 20px;">WORK EXPERIENCE</h2><h3 style="margin: 10px 0 5px;">Job Title - Company Name</h3><p style="font-style: italic; color: #666;">Month Year - Present</p><ul><li>Achievement 1</li><li>Achievement 2</li></ul>`,
      
      modern: `<div style="display: flex; gap: 20px;"><div style="width: 35%; background: #2c3e50; color: white; padding: 20px;"><h1 style="font-size: 24px;">YOUR NAME</h1><p>Professional Title</p><h3 style="margin-top: 20px;">CONTACT</h3><p>📧 email@example.com<br>📱 +91 1234567890</p><h3 style="margin-top: 20px;">SKILLS</h3><ul><li>Skill 1</li><li>Skill 2</li></ul></div><div style="width: 65%; padding: 20px;"><h2>EXPERIENCE</h2><h3>Job Title</h3><p>Company | 2020 - Present</p><ul><li>Achievement 1</li></ul></div></div>`,
      
      creative: `<div style="text-align: center; margin-bottom: 30px;"><div style="width: 100px; height: 100px; border-radius: 50%; background: #e74c3c; margin: 0 auto 10px;"></div><h1 style="font-size: 32px; color: #e74c3c;">YOUR NAME</h1><p style="color: #555;">Creative Professional</p></div><h2 style="color: #e74c3c; border-left: 4px solid #e74c3c; padding-left: 10px;">ABOUT ME</h2><p>Creative professional with passion for design.</p><h2 style="color: #e74c3c; border-left: 4px solid #e74c3c; padding-left: 10px; margin-top: 20px;">EXPERIENCE</h2><h3>Position Title</h3><p>Company | Year</p>`,
      
      minimal: `<h1 style="font-size: 36px; font-weight: 300; margin: 0;">Your Name</h1><p style="color: #666; margin: 5px 0;">email@example.com | +91 1234567890</p><hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;"><h2 style="font-size: 18px; font-weight: 400;">Experience</h2><p><strong>Job Title</strong> - Company Name<br><span style="color: #666;">2020 - Present</span></p><h2 style="font-size: 18px; font-weight: 400; margin-top: 20px;">Education</h2><p><strong>Degree</strong> - University<br><span style="color: #666;">Year</span></p>`,

      corporate: `<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;border-bottom:3px solid #1f2937;padding-bottom:10px;"><div><h1 style="margin:0;font-size:26px;color:#111827;letter-spacing:1px;">YOUR NAME</h1><p style="margin:4px 0;color:#4b5563;">Senior Corporate Professional</p></div><div style="text-align:right;font-size:12px;color:#4b5563;"><div>📧 email@example.com</div><div>📱 +91 1234567890</div><div>📍 City, State</div></div></div><div style="display:flex;gap:24px;"><div style="width:65%;"><h2 style="font-size:14px;color:#111827;border-bottom:1px solid #d1d5db;padding-bottom:4px;">PROFESSIONAL EXPERIENCE</h2><h3 style="margin:8px 0 0;font-size:13px;color:#111827;">Position Title</h3><p style="margin:0 0 4px;font-size:12px;color:#4b5563;">Company Name | 2020 - Present | Location</p><ul style="margin:0 0 10px 16px;font-size:12px;color:#374151;"><li>Lead and manage cross-functional teams to deliver key business projects.</li><li>Improve processes and reduce costs by implementing strategic initiatives.</li></ul><h2 style="font-size:14px;color:#111827;border-bottom:1px solid #d1d5db;padding-bottom:4px;margin-top:12px;">EDUCATION</h2><p style="margin:4px 0;font-size:12px;color:#111827;"><strong>MBA in Business Management</strong> – University Name</p></div><div style="width:35%;border-left:1px solid #e5e7eb;padding-left:16px;"><h2 style="font-size:14px;color:#111827;margin-bottom:6px;">CORE SKILLS</h2><ul style="margin:0 0 10px 16px;font-size:12px;color:#374151;"><li>Leadership & Strategy</li><li>Business Development</li><li>Operations Management</li><li>Team Management</li></ul><h2 style="font-size:14px;color:#111827;margin:10px 0 6px;">KEY ACHIEVEMENTS</h2><ul style="margin:0 0 10px 16px;font-size:12px;color:#374151;"><li>Increased yearly revenue by 30%.</li><li>Reduced operating cost by 15%.</li></ul></div></div>`,

      academic: `<div style="text-align:center;margin-bottom:16px;"><h1 style="margin:0;font-size:26px;color:#111827;">YOUR NAME</h1><p style="margin:4px 0;color:#4b5563;">Academic Professional | Department / Subject</p><p style="margin:2px 0;color:#6b7280;font-size:12px;">📧 email@example.com | 📱 +91 1234567890 | 📍 University / City</p></div><h2 style="font-size:14px;color:#111827;border-bottom:1px solid #d1d5db;padding-bottom:4px;">EDUCATION</h2><p style="margin:4px 0;font-size:12px;color:#111827;"><strong>Ph.D. in [Subject]</strong>, University Name, Year</p><p style="margin:2px 0;font-size:12px;color:#4b5563;">Thesis: “Title of your research work”</p><h2 style="font-size:14px;color:#111827;border-bottom:1px solid #d1d5db;padding-bottom:4px;margin-top:10px;">TEACHING EXPERIENCE</h2><p style="margin:4px 0;font-size:12px;color:#111827;"><strong>Assistant Professor</strong>, College / University</p><p style="margin:2px 0;font-size:12px;color:#4b5563;">Year – Present</p><ul style="margin:0 0 10px 16px;font-size:12px;color:#374151;"><li>Teach undergraduate and postgraduate courses in [Subject].</li><li>Guide students in projects, seminars and research activities.</li></ul><h2 style="font-size:14px;color:#111827;border-bottom:1px solid #d1d5db;padding-bottom:4px;">PUBLICATIONS</h2><ul style="margin:4px 0 10px 16px;font-size:12px;color:#374151;"><li>[Paper Title], Journal Name, Year.</li><li>[Paper Title], Conference Name, Year.</li></ul>`,

      colorful: `<div style="display:flex;gap:18px;margin-bottom:16px;"><div style="width:30%;background:linear-gradient(180deg,#6366f1,#ec4899);color:white;padding:18px;border-radius:12px;"><h1 style="margin:0 0 6px;font-size:22px;">YOUR NAME</h1><p style="margin:0 0 12px;font-size:12px;">Creative Multi-Color Resume</p><div style="font-size:11px;"><div>📧 email@example.com</div><div>📱 +91 1234567890</div><div>📍 City, State</div></div><h3 style="margin:14px 0 6px;font-size:12px;">SKILLS</h3><ul style="margin:0 0 10px 16px;font-size:11px;"><li>Design & Branding</li><li>UI/UX Basics</li><li>Presentation Skills</li></ul></div><div style="width:70%;padding:6px 0;"><div style="border-bottom:3px solid #6366f1;padding-bottom:4px;margin-bottom:6px;"><h2 style="margin:0;font-size:14px;color:#111827;">PROFILE</h2></div><p style="margin:4px 0 10px;font-size:12px;color:#374151;">Enthusiastic professional with a mix of creative and technical skills. Looking for opportunities to work in a dynamic environment.</p><div style="border-left:3px solid #ec4899;padding-left:10px;margin-bottom:8px;"><h2 style="margin:0 0 4px;font-size:14px;color:#111827;">EXPERIENCE</h2><h3 style="margin:0;font-size:13px;">Job Title – Company Name</h3><p style="margin:2px 0 4px;font-size:11px;color:#6b7280;">Year – Year | Location</p><ul style="margin:0 0 6px 16px;font-size:11px;color:#374151;"><li>Worked on colorful and engaging marketing material.</li><li>Collaborated with cross-functional teams.</li></ul></div><div style="border-left:3px solid #10b981;padding-left:10px;"><h2 style="margin:0 0 4px;font-size:14px;color:#111827;">EDUCATION</h2><p style="margin:2px 0;font-size:12px;color:#374151;"><strong>Degree Name</strong> – College / University</p></div></div></div>`,

      startup: `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><div><h1 style="margin:0;font-size:24px;color:#111827;">YOUR NAME</h1><p style="margin:2px 0;color:#4b5563;font-size:12px;">Full Stack / Startup Enthusiast</p></div><div style="font-size:11px;color:#6b7280;text-align:right;"><div>📧 email@example.com</div><div>🌐 www.portfolio.com</div><div>📱 +91 1234567890</div></div></div><div style="background:#ecfdf3;border:1px solid #bbf7d0;border-radius:8px;padding:10px;margin-bottom:10px;"><strong style="font-size:12px;color:#166534;">PITCH SUMMARY:</strong><p style="margin:4px 0;font-size:12px;color:#14532d;">Product-minded engineer with experience in early-stage startups, building MVPs quickly and iterating with users.</p></div><div style="display:flex;gap:20px;"><div style="width:60%;"><h2 style="font-size:13px;color:#111827;border-bottom:1px solid #e5e7eb;padding-bottom:3px;">EXPERIENCE</h2><h3 style="margin:4px 0;font-size:12px;color:#111827;">Founding Engineer – Startup Name</h3><p style="margin:2px 0;font-size:11px;color:#6b7280;">2021 – Present | Remote</p><ul style="margin:0 0 8px 16px;font-size:11px;color:#374151;"><li>Built and shipped MVP in under 3 months using modern web stack.</li><li>Worked closely with founder for product roadmap and user feedback.</li></ul></div><div style="width:40%;"><h2 style="font-size:13px;color:#111827;border-bottom:1px solid #e5e7eb;padding-bottom:3px;">TECH STACK</h2><ul style="margin:4px 0 8px 16px;font-size:11px;color:#374151;"><li>Frontend: Angular / React</li><li>Backend: Node / APIs</li><li>Database: SQL / NoSQL</li></ul></div></div>`
    };

    // Generate template based on name pattern
    if (templates[name]) {
      return templates[name];
    }

    // Generate dynamic template for other names
    const colors = ['#2c3e50', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
    const color = colors[name.length % colors.length];
    
    return `<div style="border-left: 5px solid ${color}; padding-left: 20px;"><h1 style="color: ${color}; margin: 0; text-transform: capitalize;">${name.replace(/[0-9]/g, '')} Resume</h1><p style="color: #666;">YOUR NAME</p><p>📧 email@example.com | 📱 +91 1234567890</p></div><h2 style="color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 5px; margin-top: 20px;">PROFESSIONAL SUMMARY</h2><p>Experienced ${name.replace(/[0-9]/g, '')} professional with proven track record.</p><h2 style="color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 5px; margin-top: 20px;">EXPERIENCE</h2><h3>Job Title - Company Name</h3><p style="font-style: italic; color: #666;">2020 - Present</p><ul><li>Key achievement 1</li><li>Key achievement 2</li><li>Key achievement 3</li></ul><h2 style="color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 5px; margin-top: 20px;">EDUCATION</h2><p><strong>Degree Name</strong> - University Name<br><span style="color: #666;">Graduation Year</span></p><h2 style="color: ${color}; border-bottom: 2px solid ${color}; padding-bottom: 5px; margin-top: 20px;">SKILLS</h2><ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;"><li>Skill 1</li><li>Skill 2</li><li>Skill 3</li><li>Skill 4</li></ul>`;
  }
}
