import { NextResponse } from 'next/server';

// In-memory store for workshops
let workshops = [
  {
    id: '1',
    title: 'Full-Stack Web Development Workshop',
    instructor: 'Jane Doe',
    rating: 4.8,
    ratingCount: 120,
    price: '2,999 Rs',
    imageUrl: 'https://manilaworkshops.com/wp-content/uploads/2023/04/Manila-Worskhops-2-1024x512.png',
    lastUpdated: 'September 2024',
    duration: '40 hours',
    lectureCount: 15,
    description: 'Learn the basics of full-stack web development with hands-on sessions.',
    highlights: [
      'HTML, CSS, JavaScript Basics',
      'Introduction to Front-end Frameworks',
      'Backend Development with Node.js',
      'Working with Databases',
      'Deploying a Full-Stack Application'
    ]
  },
  {
    id: '2',
    title: 'Data Analysis Workshop with Python',
    instructor: 'John Smith',
    rating: 4.7,
    ratingCount: 180,
    price: '3,499 Rs',
    imageUrl: 'https://framerusercontent.com/images/OPXPK3EVvWKTxyehPUHeWjtfkA.png',
    lastUpdated: 'October 2024',
    duration: '30 hours',
    lectureCount: 10,
    description: 'Learn data analysis using Python libraries like Pandas and NumPy.',
    highlights: [
      'Data Cleaning with Pandas',
      'Data Visualization with Matplotlib',
      'Data Aggregation and Analysis',
      'Working with Jupyter Notebooks'
    ]
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const workshop = workshops.find(w => w.id === id);
    return workshop 
      ? NextResponse.json(workshop)
      : NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
  }

  return NextResponse.json(workshops);
}

export async function POST(request) {
  const newWorkshop = await request.json();
  newWorkshop.id = Date.now().toString();
  workshops.push(newWorkshop);
  return NextResponse.json(newWorkshop, { status: 201 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const updatedWorkshop = await request.json();

  if (!id) {
    return NextResponse.json({ message: 'Workshop ID is required for updating' }, { status: 400 });
  }

  const index = workshops.findIndex(workshop => workshop.id === id);
  if (index !== -1) {
    workshops[index] = { ...workshops[index], ...updatedWorkshop };
    return NextResponse.json(workshops[index]);
  } else {
    return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Workshop ID is required for deletion' }, { status: 400 });
  }

  const initialLength = workshops.length;
  workshops = workshops.filter(workshop => workshop.id !== id);

  if (workshops.length !== initialLength) {
    return NextResponse.json({ message: 'Workshop deleted successfully' });
  } else {
    return NextResponse.json({ message: 'Workshop not found' }, { status: 404 });
  }
}