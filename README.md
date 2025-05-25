# E-commerce Project

A full-stack e-commerce application built with Django (backend) and React (frontend).

## Project Structure

```
project/
├── backend/          # Django backend
│   ├── products/     # Products app
│   ├── carts/        # Cart functionality
│   ├── User/         # User authentication
│   └── backend/      # Django project settings
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
    └── package.json
```

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- PostgreSQL (optional, SQLite is used by default)

## Backend Setup

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create a superuser:
```bash
python manage.py createsuperuser
```

5. Run the development server:
```bash
python manage.py runserver
```

## Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the backend directory with:
```
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Features

- User authentication (login/register)
- Product browsing and search
- Shopping cart functionality
- Product categories
- Responsive design

## API Endpoints

- `/api/products/` - List and create products
- `/api/carts/` - Cart operations
- `/api/login/` - User login
- `/api/register/` - User registration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 