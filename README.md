# Ali Hatem Portfolio 🔭

Personal portfolio website built with React 18 and Vite. Features bilingual support (Arabic RTL / English LTR), project showcases, collections, and contact functionality.

🔗 **Live Demo**: [ali-hatem-ramadan.vercel.app](https://ali-hatem-ramadan.vercel.app/)

## ✨ Features

- 🌐 **Bilingual Support** - Full Arabic (RTL) and English (LTR) support
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Framer Motion animations, Swiper carousel, AOS scroll effects
- 📂 **Project Collections** - Group related projects together
- 🎥 **Video Demos** - YouTube/Loom video integration for projects
- 📧 **Contact Form** - EmailJS-powered contact functionality

## 🛠️ Tech Stack

| Category       | Technologies               |
| -------------- | -------------------------- |
| **Framework**  | React 18, Vite             |
| **Styling**    | Bootstrap 5, CSS Modules   |
| **Animations** | Framer Motion, AOS, Swiper |
| **i18n**       | react-i18next              |
| **State**      | Redux Toolkit              |
| **Deployment** | Vercel                     |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server (localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # UI components
│   ├── header/          # Hero section
│   ├── projects/        # Project listing & cards
│   ├── Utilities/       # Swiper, loaders, etc.
│   └── ...
├── data/
│   ├── projects.json    # English project data
│   └── projectsAR.json  # Arabic project data
├── locale/
│   ├── en.json          # English translations
│   └── ar.json          # Arabic translations
├── pages/               # Route pages
└── helpers/             # Utility functions
```

## 🔧 Adding Projects

Add to both `src/data/projects.json` and `src/data/projectsAR.json`:

```json
{
  "image": "images/project.png",
  "title": "Project Name",
  "description": "...",
  "technology": ["ReactJs", "Tailwind"],
  "demo": "https://...",
  "github": "",
  "video": "https://youtu.be/...",
  "videoKey": "abc123",
  "codeStatus": "PRIVATE",
  "hidden": false
}
```

- Store images in `/public/images/`
- Set `hidden: true` to exclude from listings
- Set `codeStatus: "PRIVATE"` to show lock icon

## 🌍 Internationalization

- Translations: `src/locale/en.json` & `src/locale/ar.json`
- **Always update both files** when adding translatable text
- RTL/LTR handled automatically based on language

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the [MIT License](LICENSE)

## 📞 Contact

- **LinkedIn**: [Ali Hatem](https://www.linkedin.com/in/aliihatem-753025203/)
- **Twitter**: [@AliHate21071474](https://twitter.com/AliHate21071474)
