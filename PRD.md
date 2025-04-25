# 📝 Mini Journaling App v0.1

## TL;DR  
A simple journaling app built with Next.js to help users document thoughts/ideas and serve as a beginner-level project for learning core concepts of web development.  
The target audience is you or anyone looking for a minimal space to enter and review journal entries, with data temporarily held in local state.

---

## 🎯 Goals

### Business Goals
- Create a foundational project to learn web application development using Next.js.  
- Develop a personal tool for capturing and reviewing journal entries.

### User Goals
- Allow users to input and save journal entries conveniently.  
- Provide a basic interface to review saved entries.  
- Offer a no-login, frictionless experience where data is handled locally.

### Non-Goals
- Implementing authentication or user-specific data storage.  
- Advanced data persistence beyond local storage.

---

## 👤 User Stories
- As a **Learner**, I want to build my first web app with Next.js, so that I can understand fundamental web app concepts.  
- As a **User**, I want to quickly input journal entries, so that I can document fleeting thoughts.  
- As a **User**, I want to see my past entries, so that I can reflect on my previous thoughts.

---

## ✅ Functional Requirements

### Core Features (Priority: High)
- **Input Field**: Allow users to type journal entries.  
- **Save Button**: Save the input entry when clicked.  
- **Display Entries**: Show saved entries in a defined order.

---

## 💡 User Experience

### Entry Point
- User accesses the app via a simple homepage.

### Core Experience
1. **User types an entry** in the input field.  
   - Field must be easily accessible and focusable.  
   - Ensure clear placeholder or prompt text.
2. **User clicks "Save"** button.  
   - Validate entry is non-empty.  
   - Give visual confirmation of success.
3. **Entry appears in the list** below, preserving the order.
4. **Input field clears** after submission.

---

## ✨ Narrative

> Imagine waking up with an amazing idea. Open your journaling app, jot down the thought, and move on — all in a few clicks. No logins and no complicated processes — just you and your inspiration.

---

## 📊 Success Metrics

### User-Centric Metrics
- Ability to input and save entries.  
- Visibility of saved entries without page refresh.

### Technical Metrics
- Clean and deployable code structure.  
- Proper component usage and isolation.

---

## 🧱 Technical Considerations

### Technical Needs
- **Next.js**: Main framework for full-stack React + SSR.  
- **React**: Component-based structure.  
- **TypeScript**: Type safety + good learning opportunity.  
- **Tailwind CSS** *(optional)*: Fast and clean styling.

### Integration Points
- Use local React state to manage entries temporarily.

### Potential Challenges
- Managing the state in React and ensuring entries persist visually till refresh.

---

## ⏱ Milestones & Sequencing

### Project Estimate
- **Small**: 1–2 weeks for initial learning and development.

### Team Size & Composition
- **Extra-small**: 1 person (you), handling development, learning, and deployment.

### Suggested Phases
- **Phase 1 (Week 1)**: Basic app setup, input, save functionality, and display list.  
  **Deliverables**: Operational app, GitHub repo, and first learning thread on X.
