'use client';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import WorkshopForm from '../enrollpages/WorkshopForm'; // Make sure this path is correct
import { workshops } from '../../src/Data'; // Adjust path if necessary

const WorkshopDetails = ({ id }) => {
  const [workshop, setWorkshop] = useState(null);
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const fetchWorkshop = () => {
      const workshopId = Number(id);
      const foundWorkshop = workshops.find((w) => w.id === workshopId);
      if (foundWorkshop) {
        setWorkshop(foundWorkshop);
      } else {
        console.error(`Workshop with id ${workshopId} not found`);
      }
    };

    fetchWorkshop();
  }, [id]);

  const handleEnrollClick = () => setFormVisible(true); // Show the form
  const handleCloseForm = () => setFormVisible(false); // Hide the form

  if (!workshop) {
    return <div className="text-center text-white text-2xl mt-10">Loading workshop details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 text-gray-100">
      <div className="container mx-auto py-12 px-4 lg:px-8 flex-grow">
        {/* Workshop Header */}
        <div className="flex flex-col border-b border-gray-700 pb-8 space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/4 flex justify-center md:justify-start">
            <img
              src={workshop.imageUrl}
              alt={workshop.title}
              className="rounded-lg shadow-lg"
              style={{ width: '100%', maxWidth: '450px' }}
            />
          </div>
          <div className="w-full md:w-2/4 flex-1 space-y-2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">{workshop.title}</h2>
            <p className="text-lg text-gray-300">{workshop.description}</p>
            <p className="text-lg text-gray-300">
              <strong>Instructor:</strong> {workshop.instructor}
            </p>
            <p className="text-lg text-gray-300">
              <strong>Duration:</strong> {workshop.duration}
            </p>
            {workshop.lectureCount && (
              <p className="text-lg text-gray-300">
                <strong>Lectures:</strong> {workshop.lectureCount}
              </p>
            )}
            {workshop.rating && (
              <div className="flex mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < Math.floor(workshop.rating) ? 'text-yellow-400' : 'text-gray-400'}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-300">
                  {workshop.rating} ({workshop.ratingCount} ratings)
                </span>
              </div>
            )}
            <p className="font-bold text-2xl md:text-3xl text-indigo-400">{workshop.price}</p>
            <button
              className="mt-6 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 text-white rounded-lg transition duration-300 shadow-lg transform hover:scale-105 focus:outline-none"
              onClick={handleEnrollClick}
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* Workshop Highlights */}
        {workshop.highlights && (
          <div className="mt-12">
            <h3 className="text-3xl font-bold mb-6 text-indigo-300 text-left">Workshop Highlights</h3>
            <ul className="list-disc list-inside text-lg text-gray-300 border-l-4 border-dotted border-indigo-500 pl-6 ml-6">
              {workshop.highlights.map((highlight, index) => (
                <li key={index} className="mb-2">{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Workshop Roadmap */}
        {workshop.roadmap && (
          <div className="mt-12">
            <h3 className="text-3xl font-bold mb-6 text-indigo-300 text-left">Workshop Roadmap</h3>
            <div className="space-y-8">
              {workshop.roadmap.map((month, monthIndex) => (
                <div key={monthIndex} className="p-6 bg-gray-800 rounded-lg shadow-lg border border-indigo-600">
                  <h4 className="text-2xl font-bold mb-4 text-white">{month.month}</h4>
                  {month.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="mb-6">
                      <h5 className="text-xl font-semibold mb-3 text-indigo-200">{week.week}</h5>
                      <ul className="list-disc list-inside ml-6 text-lg text-gray-300">
                        {week.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="mb-1">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: WorkshopForm */}
      {isFormVisible && (
        
          
            <WorkshopForm course={workshop} onClose={handleCloseForm} />
          
      
      )}
    </div>
  );
};

export default WorkshopDetails;
