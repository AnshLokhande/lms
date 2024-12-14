// src/app/admindetail/eventdetail/api/eventdetail.js
import { NextApiRequest, NextApiResponse } from 'next';
let events = [
    {
      id: 1,
      title: "AI and Machine Learning Summit 2024",
      organizer: "Tech Corp",
      date: "November 15, 2024",
      location: "New York City, NY",
      price: "Free",
      imageUrl: "https://www.rrce.org/blog/wp-content/uploads/2022/11/Artifical-Intelligence.-Machine-Learning-at-RRCE.png",
      description: "A one-day summit to explore the latest trends and innovations in AI and Machine Learning.",
      agenda: [
        { time: "10:00 AM - 11:00 AM", session: "Keynote: The Future of AI", speaker: "Dr. Jane Doe" },
        { time: "11:30 AM - 1:00 PM", session: "Workshop: Building Machine Learning Models", speaker: "John Smith" },
        { time: "2:00 PM - 3:30 PM", session: "Panel Discussion: Ethics in AI", speaker: "Various Industry Leaders" },
      ],
      highlights: ["Networking Opportunities", "Hands-on Workshops", "Expert Panel Discussions"],
    },
    {
      id: 2,
      title: "Web Development Bootcamp",
      organizer: "Code Academy",
      date: "December 5-7, 2024",
      location: "Online",
      price: "1,999 Rs",
      imageUrl: "https://media.geeksforgeeks.org/wp-content/uploads/20231205165904/web-development-image.webp",
      description: "A 3-day bootcamp to master the fundamentals of web development.",
      agenda: [
        { time: "Day 1: 9:00 AM - 5:00 PM", session: "Introduction to HTML & CSS", speaker: "Alice Johnson" },
        { time: "Day 2: 9:00 AM - 5:00 PM", session: "JavaScript for Beginners", speaker: "Bob Williams" },
        { time: "Day 3: 9:00 AM - 5:00 PM", session: "Building and Deploying a Website", speaker: "Charlie Brown" },
      ],
      highlights: ["Live Coding Sessions", "Real-World Projects", "Interactive Q&A"],
    },
  ];
  
  export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (id) {
        const event = events.find(e => e.id === Number(id));
        if (event) {
          res.status(200).json(event);
        } else {
          res.status(404).json({ message: 'Event not found' });
        }
      } else {
        res.status(200).json(events);
      }
    } else if (req.method === 'POST') {
      const newEvent = { id: Date.now(), ...req.body };
      events.push(newEvent);
      res.status(201).json(newEvent);
    } else if (req.method === 'PUT') {
      const { id } = req.body;
      const index = events.findIndex(event => event.id === id);
      if (index > -1) {
        events[index] = { ...events[index], ...req.body };
        res.status(200).json(events[index]);
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      const index = events.findIndex(event => event.id === Number(id));
      if (index > -1) {
        const deletedEvent = events.splice(index, 1);
        res.status(200).json(deletedEvent[0]);
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  