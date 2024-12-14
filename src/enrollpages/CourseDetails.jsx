'use client';
import React, { useState } from 'react';
import { courses } from '../../src/Data';
import EnrollmentForm from './EnrollmentForm';
import { useRouter } from 'next/navigation';

const CourseDetails = ({ params }) => {
  const courseId = params;
  const course = courses.find(c => c.id === Number(courseId));
  const [isFormVisible, setFormVisible] = useState(false);
  const router = useRouter();



  const handleEnrollClick = () => {
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 text-gray-100">
  <div className="container mx-auto py-12 px-6 flex-grow">
    {/* Course Header */}
    <div className="flex flex-col  items-start justify-center   border-b border-gray-700 pb-8">
      <div className="w-full md:w-1/3 mb-8 md:mb-0 flex justify-center">
        <img
          src={course?.imageUrl}
          alt={course?.title}
          className="rounded-lg shadow-lg object-cover"
          style={{  width: '100%', maxWidth: '450px'}}
        />
      </div>
          <div className="md:ml-8 flex-">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">{course?.title}</h2>
            <p className="mb-4 text-base md:text-lg text-gray-300">{course?.description}</p>
            <p className="text-lg text-gray-300"><strong>Instructor:</strong> {course?.instructor}</p>
            <p className="text-lg text-gray-300"><strong>Duration:</strong> {course?.duration}</p>
            <p className="text-lg text-gray-300"><strong>Lectures:</strong> {course?.lectureCount}</p>
            <p className="font-bold mt-6 text-2xl md:text-3xl text-indigo-400">{course?.price}</p>
            <button
              className="mt-6 py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
              onClick={handleEnrollClick}
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* Course Highlights */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-indigo-300">Course Highlights</h3>
          <ul className="list-disc list-inside text-lg ml-8 text-gray-300 border-l-4 border-dotted border-indigo-500 pl-4">
            {course.highlights.map((highlight, index) => (
              <li key={index} className="mb-2">{highlight}</li>
            ))}
          </ul>
        </div>

        {/* Course Roadmap */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold mb-6 text-indigo-300">Course Roadmap</h3>
          <div className="space-y-8">
            {course.roadmap.map((month, monthIndex) => (
              <div key={monthIndex} className="p-6 bg-gray-800 rounded-lg shadow-lg border border-indigo-600">
                <h4 className="text-2xl font-bold mb-4 text-white">{month?.month}</h4>
                {month.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="mb-6">
                    <h5 className="text-xl font-semibold mb-3 text-indigo-200">{week?.week}</h5>
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
      </div>

      {isFormVisible && <EnrollmentForm course={course} onClose={handleCloseForm} />}
    </div>
  );
};

export default CourseDetails;
