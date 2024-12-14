'use client'

import React, { useState, useEffect } from "react"
import { FaPlayCircle } from "react-icons/fa"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import EnrollmentForm from "../src/enrollpages/EnrollmentForm"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [hoveredPopularCourse, setHoveredPopularCourse] = useState(null)
  const [hoveredAllCourse, setHoveredAllCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/courses')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      setError("Failed to load courses. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const popularCourses = courses.slice(0, 4)

  const handleMoreInfoClick = (courseId) => {
    router.push(`/enroll/${courseId}`)
  }
  const handleEnrollClick = (course) => {
    setSelectedCourse(course)
    setIsFormOpen(true)
  }

  const closeEnrollmentForm = () => {
    setIsFormOpen(false)
    setSelectedCourse(null)
  }
  const CourseCard = ({ course, isHovered, setHovered, isPopular }) => (
    <div
      key={course.id}
      className="flex-shrink-0 w-64 md:w-auto bg-white text-black shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setHovered(course.id)}
      onMouseLeave={() => setHovered(null)}
    >
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-lg truncate">{course.title}</h4>
        <p className="text-sm text-gray-500">{course.instructor}</p>
        <p className="font-bold text-lg text-indigo-900 mt-2">{course.price}</p>
      </div>
      {isHovered === course.id && (
        <div className="absolute inset-0 bg-black bg-opacity-90 p-4 flex flex-col justify-center space-y-3 overflow-auto">
          <h4 className="font-semibold text-white text-lg">{course.title}</h4>
          <p className="text-sm text-white">{course.lastUpdated}</p>
          <p className="text-sm text-white">
            {course.duration} total hours · {course.lectureCount} lectures · All Levels
          </p>
          <p className="text-sm text-white line-clamp-3">{course.description}</p>
          <ul className="text-sm text-white space-y-1">
            {course.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center">
                <FaPlayCircle className="mr-1 text-blue-500" /> {highlight}
              </li>
            ))}
          </ul>
          <div className="flex space-x-2">
            <button
              onClick={() => handleMoreInfoClick(course.id)}
              className="mt-4 py-2 px-4 w-full font-semibold rounded bg-blue-600 text-white hover:bg-blue-800 transition duration-300"
            >
              More Info
            </button>
            <button
              onClick={() => handleEnrollClick(course)}
              className="mt-4 py-2 px-4 w-full font-semibold rounded bg-green-600 text-white hover:bg-green-800 transition duration-300"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-900 text-white">
        <p className="text-xl">Loading courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-900 text-white">
        <p className="text-xl text-red-500">{error}</p>
        <button 
          onClick={fetchCourses}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 text-gray-100">
      <div className="container mx-auto flex-grow py-12 px-4 md:px-8">
        {/* Popular Courses Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold mb-8 text-center text-white">Popular Courses</h2>
          <div className="overflow-x-auto md:overflow-visible px-4 md:px-0">
            <div className="flex md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {popularCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isHovered={hoveredPopularCourse}
                  setHovered={setHoveredPopularCourse}
                  isPopular={true}
                />
              ))}
            </div>
          </div>
        </section>

        {/* All Courses Section */}
        <section>
          <h2 className="text-4xl font-bold mb-8 text-center text-white">All Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isHovered={hoveredAllCourse}
                setHovered={setHoveredAllCourse}
                isPopular={false}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Enrollment Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <button
              onClick={closeEnrollmentForm}
              className="text-red-500 font-bold absolute top-2 right-2"
            >
              Close
            </button>
            <EnrollmentForm course={selectedCourse} onClose={closeEnrollmentForm} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses