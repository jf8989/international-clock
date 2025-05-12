<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier"/>
  <img src="https://img.shields.io/badge/Stylelint-263238?style=for-the-badge&logo=stylelint&logoColor=white" alt="Stylelint"/>
  <img src="https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white" alt="PostCSS"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

# International Mechanical Timekeeper

The **International Mechanical Timekeeper** is a web application designed to display the current time accurately across different timezones using an interactive, animated SVG mechanical clock. It's built on a modern Next.js and React stack, leveraging a robust foundation for rapid development and a rich user experience.

This project was initiated using a comprehensive Next.js template, which provided a solid, pre-configured starting point. This allowed development to focus directly on building the core clock functionalities and user interface.

## Project Purpose, Status, and Usage

*   **Purpose:** This project primarily serves as a **demonstration of my web development skills**, particularly in front-end technologies like React, Next.js, TypeScript, and SVG manipulation, as well as full-stack integration concepts.
*   **Status:** This is an **ongoing, work-in-progress** project. Features are continuously being developed, refined, and added.
*   **Usage & Licensing:**
    *   You are welcome to **study the codebase** for educational purposes, learn from the techniques implemented, and experiment with it for personal, non-commercial projects.
    *   This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) License**.
    *   **Commercial use of this codebase, or substantial portions thereof, is strictly prohibited.** This means you cannot use this code (or significant parts of it) in a product or service that is sold or generates revenue.
    *   If you adapt, remix, or build upon this material for non-commercial purposes, you must distribute your contributions under the same CC BY-NC-SA 4.0 license.
    *   Please see the [LICENSE](./LICENSE) file for full details.

## Core Features

The application boasts a range of features designed for an intuitive and accurate timekeeping experience:

*   **Interactive SVG Mechanical Clock (`MechanicalClock.tsx`):**
    *   Displays a visually appealing analog clock face.
    *   Real-time, smoothly animated hands (hour, minute, second) reflecting the selected timezone's current time.
    *   Customizable size, with styling driven by Tailwind CSS and theme-aware CSS variables.
*   **Dynamic Timezone Selector (`TimezoneSelector.tsx`):**
    *   Allows users to select from a comprehensive list of IANA (Internet Assigned Numbers Authority) timezones.
    *   Timezones are intelligently grouped by UTC offset and displayed with representative city names (e.g., "(GMT-05:00) New York, Chicago, Mexico City").
    *   Features live search/filtering for quick timezone lookup.
    *   Full keyboard navigation support (ArrowUp, ArrowDown, Enter, Escape) for accessibility.
    *   Efficiently fetches and processes timezone data using the `Intl` API, with robust fallbacks and error handling.
    *   Optimized rendering using `React.memo`.
*   **Real-Time Updates (`useTimeInTimezone.ts`):**
    *   A custom React hook (`useTimeInTimezone`) provides the current time (hours, minutes, seconds), updating every second for the chosen timezone.
    *   Utilizes `Intl.DateTimeFormat` for precise timezone calculations.
*   **Comprehensive Utility Library (`src/lib/utils.ts`):**
    *   `cn()`: For streamlined conditional class name generation with Tailwind CSS.
    *   `formatCurrency()`: For locale-aware currency formatting.
    *   `formatDate()`: For flexible and localized date formatting.
    *   `truncateText()`: For truncating text while respecting word boundaries.
    *   `debounce()`: For rate-limiting function calls.
    *   `generateId()`: For creating simple unique identifiers.
    *   `capitalizeFirstLetter()`: For string capitalization.
    *   `sleep()`: A Promise-based delay utility.
*   **Responsive Design:** Adapts seamlessly to various screen sizes, built with Tailwind CSS.
*   **Theming:** Supports light and dark modes through CSS variables.

## Technologies & Stack

The application is built using the following modern technologies, benefiting from a pre-configured setup that accelerated the development of its core features:

*   **Next.js (App Router):** Leverages the latest Next.js features for routing, server components, and optimized performance. Font loading is handled via `next/font` and `geist/font`.
*   **React & Animation:** Built with the latest React. Animation capabilities are provided by `tailwindcss-animate` for CSS-driven effects, with the project ready for Framer Motion if more complex animations are desired.
*   **Tailwind CSS:** Fully configured for utility-first styling.
    *   **CSS Variables:** Extensively used for theming (colors, spacing, radius), supporting light/dark modes and easy customization.
    *   **Plugins:** Includes `@tailwindcss/typography`, `@tailwindcss/forms`, and `@tailwindcss/aspect-ratio`.
*   **TypeScript:** Enforces strict type checking and modern syntax throughout the codebase.
*   **Styling & UI Utilities:**
    *   `globals.css`: Contains base styles, CSS variable definitions for themes.
    *   `clsx` & `tailwind-merge` (via `cn` utility): Ensure robust and conflict-free conditional class names.
*   **Linting & Formatting:** ESLint, Prettier, and Stylelint are configured to maintain code quality and consistency.
*   **VS Code Integration:** Optimized settings in `.vscode/settings.json` for a smooth development experience.

## Getting Started / Development Setup

To run or contribute to the International Mechanical Timekeeper:

### 1. Clone the Repository
Open your terminal and clone the project:
```bash
# Replace <repository_url> with the actual URL of this project's repository
git clone <repository_url> international-mechanical-timekeeper
cd international-mechanical-timekeeper
```

### 2. Install Dependencies
Install the necessary Node.js packages:
```bash
npm install
```
*If you need a specific Node.js version, consider using a version manager like NVM.*

### 3. Start the Development Server
Run the development server:
```bash
npm run dev
```

### 4. View The Application
- Open your browser and navigate to `http://localhost:3000`.
- You should see the International Mechanical Timekeeper application.

### Development Branching Strategy (Example)
- For new features or bug fixes, create a new branch:
  ```bash
  # Example: git checkout -b feature/add-alarm-functionality
  git checkout -b <your-branch-name>
  ```
- Make your changes, commit them, and then push to the remote repository.

## Project Structure

```
international-mechanical-timekeeper/
├── .vscode/            # VS Code specific settings
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router: pages, layouts, globals.css
│   │   ├── layout.tsx  # Main application layout
│   │   ├── page.tsx    # Home page (hosting the Timekeeper application)
│   │   └── globals.css # Global styles & CSS variable definitions
│   ├── components/     # Reusable React components
│   │   └── clock/      # Clock-specific components
│   │       ├── MechanicalClock.tsx
│   │       └── TimezoneSelector.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useTimeInTimezone.ts
│   └── lib/            # Utility functions
│       └── utils.ts    # General utility functions
├── tailwind.config.ts  # Tailwind CSS configuration
├── postcss.config.mjs  # PostCSS configuration
├── tsconfig.json       # TypeScript configuration
├── next.config.ts      # Next.js configuration
├── eslint.config.mjs   # ESLint configuration
├── stylelint.config.js # Stylelint configuration
├── LICENSE             # Project license file
└── package.json        # Project dependencies and scripts
```

## Development Tips

### Creating New Pages (If Extending the App)
To add a new page (e.g., an "About" page for the clock):
1.  Create a new folder in `src/app` (e.g., `about`).
2.  Add a `page.tsx` file inside that folder.
    ```
    src/
    └── app/
        └── about/
            └── page.tsx    # Creates /about page
    ```

### Adding Styles
Utilize Tailwind CSS classes directly in your React components. Refer to `globals.css` for defined CSS variables (like `--card`) and custom component layer classes.

## Deployment

This application is configured for easy deployment, especially with Vercel.

### Deploying Feature Branches (Previews)
1.  Ensure you are on the branch you want to deploy (e.g., `feature/new-clock-face`).
2.  Use the Vercel CLI:
    ```bash
    vercel
    ```
3.  Follow the Vercel CLI prompts. If it's the first time deploying this project from your local setup, you might need to link it to a new or existing Vercel project.
    *   "Set up and deploy" → Enter
    *   "Which scope?" → Choose your Vercel account
    *   "Link to existing project?" → `N` (if creating a new Vercel project for this instance) or `Y` (if linking to an existing one).
    *   Follow the remaining auto-detected settings.
    Vercel will provide a preview URL.

### Production Deployment (Main Branch)
1.  Ensure your `main` (or primary) branch has the latest stable code.
2.  Push changes to your Git remote: `git push origin main`
3.  If your Vercel project is connected to your Git repository, Vercel will typically auto-deploy the `main` branch.
4.  To trigger a production deployment manually for the current commit:
    ```bash
    vercel --prod
    ```

### Vercel CLI Setup (If not already installed)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login
```

## Common Issues & Solutions During Setup

-   **`git clone` fails:** Ensure Git is installed (from [git-scm.com](https://git-scm.com/downloads)).
-   **`npm` commands fail:** Ensure Node.js (LTS version recommended) is installed (from [nodejs.org](https://nodejs.org)).
-   **PowerShell script execution policy (Windows):** If PowerShell blocks script execution, open PowerShell as Administrator and run `Set-ExecutionPolicy RemoteSigned`, then type 'Y' to accept.

## Need Help?

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Geist Font Documentation](https://vercel.com/font)
- [Intl API (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License**.
See the [LICENSE](./LICENSE) file for details.