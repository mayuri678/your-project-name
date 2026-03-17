# Resume Templates - Storage Locations Guide

## 📁 Where Templates Are Saved

### 1. **LocalStorage (Browser)**
```
Key: 'localResumes'
Location: Browser's LocalStorage
Structure: Array of resume objects
```

**Example:**
```json
[
  {
    "id": "local_1234567890",
    "template_id": 1,
    "resume_name": "My Resume",
    "resume_data": {
      "name": "John Doe",
      "title": "Senior Engineer",
      "email": "john@example.com",
      "phone": "+1 234 567 8900",
      "location": "San Francisco, CA",
      "linkedin": "linkedin.com/in/johndoe",
      "summary": "...",
      "skills": ["Angular", "TypeScript", "Node.js"],
      "experience": [...],
      "education": [...],
      "certifications": [...],
      "photo": "base64_image_data"
    },
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**Access in Code:**
```typescript
// Save
const localResumes = JSON.parse(localStorage.getItem('localResumes') || '[]');
localResumes.push(newResume);
localStorage.setItem('localResumes', JSON.stringify(localResumes));

// Load
const resumes = JSON.parse(localStorage.getItem('localResumes') || '[]');
```

---

### 2. **Supabase Database (Cloud)**
**Table:** `user_resumes`

**Columns:**
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to auth.users)
- `template_id` - Integer (Template number 1-55)
- `resume_name` - String (Resume title)
- `resume_data` - JSON (Complete resume object)
- `status` - String ('draft', 'completed', 'published')
- `created_at` - Timestamp
- `updated_at` - Timestamp

**Example Query:**
```sql
SELECT * FROM user_resumes 
WHERE user_id = 'user-uuid' 
ORDER BY updated_at DESC;
```

**Access in Code:**
```typescript
const { data, error } = await supabase
  .from('user_resumes')
  .insert({
    user_id: user.id,
    template_id: 1,
    resume_data: resumeData,
    resume_name: 'My Resume',
    status: 'draft'
  })
  .select()
  .single();
```

---

### 3. **Current Session (Memory)**
**Key:** `'currentResumeData'`
**Location:** Browser's LocalStorage
**Purpose:** Temporary storage during editing

```typescript
// Save current session
localStorage.setItem('currentResumeData', JSON.stringify(resumeData));

// Load on page refresh
const savedData = localStorage.getItem('currentResumeData');
if (savedData) {
  this.resumeData = JSON.parse(savedData);
}
```

---

### 4. **My Templates (LocalStorage)**
**Key:** `'my_resume_' + timestamp`
**Location:** Browser's LocalStorage
**Purpose:** Saved completed resumes

```json
{
  "id": "my_resume_1234567890",
  "name": "My Resume",
  "category": "My Resumes",
  "thumbnail": "base64_image",
  "resumeData": {...},
  "templateId": 1,
  "savedAt": "2024-01-15T10:30:00Z",
  "status": "completed"
}
```

---

## 🔄 Resume Data Flow

### Creating a New Resume:
```
1. User selects template from templates-page
2. Resume builder loads with template
3. User fills in resume data
4. Data stored in memory (resumeData object)
5. User clicks "Save"
   ├─ If logged in (Supabase) → Save to user_resumes table
   ├─ If admin → Save to localStorage (localResumes)
   └─ If not logged in → Save to localStorage (localResumes)
6. currentResumeData updated in localStorage
```

### Saving Resume:
```typescript
// Location: resume-builder.component.ts - saveResume()

if (user) {
  // Supabase user - save to cloud
  await supabase.from('user_resumes').insert({...})
} else if (adminToken) {
  // Admin user - save to localStorage
  localStorage.setItem('localResumes', JSON.stringify(localResumes))
} else {
  // Guest user - save to localStorage
  localStorage.setItem('localResumes', JSON.stringify(localResumes))
}
```

---

## 📊 Resume Data Structure

```typescript
interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  projects: any[];
  certifications: string[];
  photo: string; // base64 encoded image
}
```

---

## 🎯 Template Files Location

**Path:** `src/app/resume-templates/`

### Template Structure:
```
template-01/
├── template-01.component.ts
├── template-01.component.html
├── template-02.component.ts
└── template-02.component.html

template-02/
├── template-2.component.ts
└── template-2.component.html

... (template-03 to template-55)
```

### Template Registry:
**File:** `src/app/resume-templates/template-registry.service.ts`

```typescript
// Maps template ID to component
getTemplateById(id: number): TemplateInfo {
  // Returns { name, component, category }
}
```

---

## 💾 How to Access Saved Resumes

### From LocalStorage:
```typescript
// Get all local resumes
const localResumes = JSON.parse(localStorage.getItem('localResumes') || '[]');

// Get specific resume
const resume = localResumes.find(r => r.id === 'resume_id');

// Get current session resume
const currentResume = JSON.parse(localStorage.getItem('currentResumeData'));

// Get my templates
const myTemplates = Object.keys(localStorage)
  .filter(key => key.startsWith('my_resume_'))
  .map(key => JSON.parse(localStorage.getItem(key)));
```

### From Supabase:
```typescript
// Get all user resumes
const { data } = await supabase
  .from('user_resumes')
  .select('*')
  .eq('user_id', userId)
  .order('updated_at', { ascending: false });

// Get specific resume
const { data } = await supabase
  .from('user_resumes')
  .select('*')
  .eq('id', resumeId)
  .single();
```

---

## 🔐 Data Persistence

| Storage | Persistence | Capacity | Access |
|---------|-------------|----------|--------|
| LocalStorage | Until cleared | ~5-10MB | Browser only |
| Supabase | Permanent | Unlimited | Cloud (with auth) |
| Memory | Session only | Unlimited | Current session |

---

## 📝 File Paths Summary

```
Resume Data Storage:
├── LocalStorage
│   ├── localResumes (all saved resumes)
│   ├── currentResumeData (current session)
│   └── my_resume_* (completed templates)
│
├── Supabase Database
│   └── user_resumes table
│
└── Template Files
    └── src/app/resume-templates/template-*/
        ├── template-*.component.ts
        └── template-*.component.html
```

---

## 🚀 Quick Reference

**Save Resume:**
- Location: `resume-builder.component.ts` → `saveResume()`
- Stores in: LocalStorage or Supabase

**Load Resume:**
- Location: `resume-builder.component.ts` → `loadExistingResume()`
- Reads from: Supabase or LocalStorage

**Download PDF:**
- Location: `resume-builder.component.ts` → `downloadPDF()`
- Also saves to: My Templates (LocalStorage)

**Current Data:**
- Key: `currentResumeData`
- Updated: Every time user edits
- Cleared: On logout or new resume
