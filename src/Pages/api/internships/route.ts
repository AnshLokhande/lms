import { NextResponse } from 'next/server';

// In-memory store for internships (replace with database in production)
let internships = [
  {
    id: '1',
    title: 'Software Development Intern',
    company: 'Tech Solutions Inc.',
    stipend: '$1000/month',
    duration: '3 months',
    description: 'Join our team to work on cutting-edge web applications.',
    summaryDescription: 'Exciting opportunity in web development',
    imageUrl: '/placeholder.svg?height=300&width=400',
    highlights: ['React', 'Node.js', 'Agile development'],
    location: 'San Francisco, CA',
    organizer: 'Tech Solutions HR'
  },
  // Add more internship objects as needed
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const internship = internships.find(i => i.id === id);
    return internship 
      ? NextResponse.json(internship)
      : NextResponse.json({ message: 'Internship not found' }, { status: 404 });
  }

  return NextResponse.json(internships);
}

export async function POST(request) {
  const newInternship = await request.json();
  newInternship.id = Date.now().toString();
  internships.push(newInternship);
  return NextResponse.json(newInternship, { status: 201 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const updatedInternship = await request.json();

  if (!id) {
    return NextResponse.json({ message: 'Internship ID is required for updating' }, { status: 400 });
  }

  const index = internships.findIndex(internship => internship.id === id);
  if (index !== -1) {
    internships[index] = { ...internships[index], ...updatedInternship };
    return NextResponse.json(internships[index]);
  } else {
    return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Internship ID is required for deletion' }, { status: 400 });
  }

  const initialLength = internships.length;
  internships = internships.filter(internship => internship.id !== id);

  if (internships.length !== initialLength) {
    return NextResponse.json({ message: 'Internship deleted successfully' });
  } else {
    return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
  }
}