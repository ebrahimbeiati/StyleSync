AI-Powered Digital Wardrobe & Outfit Planner
Introduction

AI-Powered Digital Wardrobe & Outfit Planner is a modern, front-end web application that allows users to upload clothing images, organise their wardrobe, create outfit combinations, and plan their looks in advance. Users can customise mannequins by demographic, compare outfits side by side, and gather inspiration from both historical and modern fashion trends. This project showcases advanced React and TypeScript skills while delivering a highly interactive user experience.

Tech Stack
Frontend
React 19
TypeScript
Vite (for fast bundling and development)
Styling & UI
Tailwind CSS (utility-first styling)
Shadcn/UI (pre-built, accessible components)
State Management
Zustand (lightweight, minimal API for global state)
Drag & Drop
Dnd Kit (flexible drag-and-drop library)
Image Upload
React Dropzone (for drag-and-drop image uploads)
Testing
Vitest (unit and integration testing)
React Testing Library (testing components and user interactions)
Build Tools
Vite (fast bundler)
ESLint (code linting)
Prettier (code formatting)
Data Handling
All data is session-based; no user data is persisted after a page refresh.
Users can manually download their outfit history as a PDF or image if they wish to save it.
Core Features
Digital Wardrobe Management
Upload clothing images through drag-and-drop or file selection.
Organise and categorise clothing items (e.g., tops, bottoms, shoes).
View and manage wardrobe inventory visually.
Outfit Builder
Drag clothing items onto a customizable mannequin.
Layer multiple clothing items.
Rotate and reposition items.
Zoom into the mannequin for detailed views.
Preview complete outfits before saving them.
Customizable Mannequins

Users can personalize mannequins based on demographics:

Women: Adjust height (short, average, tall), body shape (slim, curvy, plus-sized), and skin tone.
Men: Adjust height (short, average, tall), build (slim, athletic, broad), and skin tone.
Kids: After selecting Boys or Girls, users can adjust height ranges, age groups, body shapes, and skin tone.
Wardrobe Categories

Users organise their wardrobe into clear categories:

Clothing: Tops, Bottoms, Dresses, Jackets.
Footwear: Shoes.
Accessories: Accessories.
Search & Filters

Users can quickly locate items using advanced filtering:

Filter by color, Season, Occasion, Brand, and Style.
Instant search with live updates.
Multi-filter combinations across categories.
Recently viewed items and favourites.
Outfit History & Comparison

Users can save outfits during the session for later comparison.

Features include:

Side-by-side outfit comparison.
Outfit history tracking (session-based only).
Favourite outfits marking.
Deletion of outfits.
Export outfit history as a PDF or image.

Note: All outfit history is temporary and cleared on page refresh unless downloaded.

Calendar Planner

Users can plan outfits in advance using a calendar:

Plan outfits for Work, Holidays, Events, and School.
Features include daily, weekly, and monthly planning.
Outfit reminders and scheduled previews.
Fashion Inspiration
Historical Fashion Gallery: Browse curated fashion images from past decades.
\*\*Modern
“You just established at the fashion inspiration.”

Ah, right! Let me continue from there so it’s complete.

Fashion Inspiration
Historical Fashion Gallery: Browse curated fashion images from past decades to spark outfit ideas and discover vintage trends.
Modern Fashion Trends: Explore a curated section of current fashion trends, giving users inspiration for their everyday looks.
Future Enhancements
AI Outfit Recommendations

In future versions, we plan to integrate AI-powered outfit suggestions based on:

Existing wardrobe items
color matching
Seasonal trends
Occasion requirements
Weather-Based Recommendations

Suggest outfits based on live weather conditions:

Temperature
Rain or snow
Seasonal conditions
User Accounts
Enable user authentication to save outfits across sessions.
Cloud synchronisation for cross-device access.
Personal wardrobe backups.
Social Features
Outfit sharing to social media or with friends.
Community inspiration galleries.
Collections of favourite outfits.
User Experience
Problem Statement

Many people struggle to remember what they own or how to pair outfits they already have. This app addresses that by giving users a digital wardrobe, allowing them to see all their clothes, mix and match, and plan outfits ahead.

User Journey
Upload clothing images by dragging and dropping or selecting files.
Categorise items (tops, bottoms, shoes, etc.).
Build a personalised mannequin based on height, body shape, and skin tone.
Drag clothing onto the mannequin to build outfits.
Save outfits into a session history.
Compare outfits side by side and mark favourites.
Plan future outfits using the calendar planner.
Download outfit history as a PDF or image to keep a record.
Tech Stack

(As listed above)

Architecture

The project is structured into clear, modular components:

Components: Wardrobe, Outfit Builder, Calendar Planner, Search & Filters, Inspiration Gallery.
State: Managed globally using Zustand for lightweight state management.
Services: Future AI recommendations (planned).
Hooks: Custom React hooks to manage user interactions and drag-and-drop state.
Assets: Clothing images are stored locally and cleared on refresh.
Accessibility

The application adheres to accessibility best practices:

Keyboard navigation support.
Screen reader compatibility.
color contrast compliance.
Responsive layout for all device sizes.
Accessible form controls and focus management.
Performance
Images are lazy-loaded for faster rendering.
Code is split into smaller chunks to improve load times.
Zustand state updates are memoised for efficiency.
Virtualised lists used for large wardrobe collections.
Testing Strategy
Unit tests with Vitest for components, utility functions, and state logic.
Integration tests with React Testing Library for outfit building, wardrobe management, and calendar planning.
Accessibility tests ensure keyboard and screen-reader usability.
User Data Handling
All user interactions and data (e.g., outfit combinations) are stored only during the session in memory.
No user data (images, outfits, preferences) is saved or sent to a server.
Users have the option to download their session outfits as a PDF or image before closing or refreshing.
Future Enhancements

(As listed above)
