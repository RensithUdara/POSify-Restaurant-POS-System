# POSify - Restaurant Point of Sale System

A comprehensive, modern Restaurant POS System built with Next.js 15, React 19, TypeScript, and Tailwind CSS. POSify provides everything you need to manage your restaurant operations efficiently.

![POSify Dashboard](https://via.placeholder.com/800x400/10B981/ffffff?text=POSify+Restaurant+POS+System)

## 🚀 Features

### Core POS Features
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🛒 Smart Cart Management**: Add, remove, and modify items with real-time calculations
- **🍽️ Menu Management**: Categorized menu with search, filtering, and item details
- **💳 Payment Processing**: Support for cash, card, and digital payments
- **📊 Real-time Analytics**: Sales tracking, revenue reports, and performance metrics
- **🏪 Order Management**: Track orders from preparation to completion
- **🎯 Table Management**: Handle dine-in, takeaway, and delivery orders
- **👥 Customer Management**: Store customer information and order history

### Advanced Features
- **📈 Analytics Dashboard**: Detailed insights into sales, popular items, and peak hours
- **🔔 Real-time Notifications**: Order status updates and system alerts
- **📱 Mobile-First Design**: Optimized for tablets and smartphones
- **🌙 Theme Support**: Light and dark mode compatibility
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations
- **⚡ Performance Optimized**: Fast loading and responsive interactions

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **State Management**: React Context API with Reducers  
- **Charts**: Recharts for analytics visualization
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications
- **Forms**: React Hook Form with Zod validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/posify-restaurant-pos.git
   cd posify-restaurant-pos
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
posify-restaurant-pos/
├── app/                    # Next.js 13+ App Router
│   ├── analytics/         # Analytics page
│   ├── orders/           # Orders management page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main POS interface
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── cart.tsx          # Shopping cart component
│   ├── food-card.tsx     # Menu item component
│   ├── food-grid.tsx     # Menu items grid
│   ├── header.tsx        # Application header
│   ├── sidebar-nav.tsx   # Navigation sidebar
│   └── ...               # Other components
├── context/              # React Context providers
│   └── POSContext.tsx    # Main POS state management
├── types/                # TypeScript type definitions
│   └── index.ts          # Main type definitions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## 🎯 Key Components

### POSContext
Central state management for the entire application:
- Cart management
- Order processing
- Menu items
- Customer information
- Settings and preferences

### Menu System
- **Categories**: Organized menu categories (Appetizers, Mains, Desserts, etc.)
- **Items**: Detailed menu items with pricing, ingredients, and dietary information
- **Search & Filter**: Find items quickly with advanced filtering options

### Order Processing
- **Cart Management**: Add/remove items, adjust quantities, special instructions
- **Order Types**: Support for dine-in, takeaway, and delivery orders
- **Payment Methods**: Cash, card, and digital payment options
- **Status Tracking**: Real-time order status updates

### Analytics Dashboard
- **Sales Metrics**: Revenue tracking, order counts, and performance indicators
- **Visual Charts**: Interactive charts showing sales by hour, category distribution
- **Top Items**: Most popular menu items and revenue generators
- **Performance Stats**: Completion rates, customer satisfaction metrics

## 📱 Mobile Experience

POSify is designed mobile-first with special considerations for:
- **Touch-friendly interfaces** with appropriate button sizes
- **Responsive layouts** that adapt to different screen sizes
- **Mobile cart** with slide-out functionality
- **Gesture support** for common actions
- **Offline capability** for basic operations

## 🔧 Configuration

### Restaurant Settings
Customize your restaurant details in the POS context:
```typescript
settings: {
  restaurantName: 'Your Restaurant Name',
  currency: 'USD',
  taxRate: 0.08,
  serviceCharge: 0.10,
  orderAutoAccept: true,
  printReceipts: true,
  theme: 'light'
}
```

### Menu Items
Add your menu items by modifying the menu data:
```typescript
{
  id: 'unique-id',
  name: 'Item Name',
  description: 'Item description',
  price: 19.99,
  category: 'category-id',
  image: 'image-url',
  type: 'Veg' | 'Non Veg',
  available: true,
  preparationTime: 15,
  ingredients: ['ingredient1', 'ingredient2'],
  allergens: ['allergen1', 'allergen2']
}
```

## 🎨 Customization

### Themes
The application supports light and dark themes. Theme switching can be implemented using the built-in theme provider.

### Colors
Primary colors can be customized in `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  }
}
```

### Components
All UI components are built with Radix UI and can be customized by modifying the component files in `components/ui/`.

## 📊 Analytics Features

### Sales Tracking
- Hourly sales breakdown
- Daily, weekly, and monthly reports
- Revenue by category
- Payment method distribution

### Performance Metrics
- Average order value
- Order completion rates
- Peak hour identification
- Customer satisfaction scores

### Inventory Insights
- Top-selling items
- Low-performing products
- Category performance
- Seasonal trends

## 🔐 Security Features

- **Input validation** with Zod schemas
- **Type safety** with TypeScript
- **Secure state management** with proper encapsulation
- **XSS protection** through React's built-in protections

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

### Other Platforms
- **Netlify**: Build command `npm run build`, publish directory `out`
- **AWS Amplify**: Follow the Next.js deployment guide
- **Docker**: Use the provided Dockerfile for containerized deployment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@posify.com
- Documentation: [docs.posify.com](https://docs.posify.com)

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**POSify** - Making restaurant management simple and efficient! 🍽️✨