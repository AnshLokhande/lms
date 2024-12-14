'use client'

import React, { useState, useEffect } from "react"
import { FaCalendarAlt } from "react-icons/fa"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from '../../components/landing-page'
import PaymentHandlerButton from "../../components/PaymentHandlerButton"

const Workshops = () => {
  const [workshops, setWorkshops] = useState([])
  const [hoveredPopularWorkshop, setHoveredPopularWorkshop] = useState(null)
  const [hoveredAllWorkshop, setHoveredAllWorkshop] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""

  useEffect(() => {
    fetchWorkshops()
  }, [])

  const fetchWorkshops = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/workshops')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setWorkshops(data)
    } catch (error) {
      console.error("Failed to fetch workshops:", error)
      setError("Failed to load workshops. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const popularWorkshops = workshops.slice(0, 2)

  const handleMoreInfoClick = (workshopId) => {
    router.push(`/workshop/${workshopId}`)
  }

  const price = (price) => {
    if (price === "Free") {
      return 1
    } else {
      const priceFloat = parseFloat(
        price.replace(/[^0-9.-]+/g, "").replace(",", "")
      )
      return priceFloat
    }
  }

  const WorkshopCard = ({ workshop, isHovered, setHovered, isPopular }) => (
    <div
      key={workshop.id}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "70%",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 0.3s ease-in-out",
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        border: "2px solid #3b82f6",
        margin: "8px",
        minWidth: isPopular ? "auto" : "250px"
      }}
      onMouseEnter={() => setHovered(workshop.id)}
      onMouseLeave={() => setHovered(null)}
      className="transform transition duration-300 hover:scale-105"
    >
      <img 
        src={workshop.imageUrl} 
        alt={workshop.title} 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }} 
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: "8px",
          background: "rgba(0, 0, 0, 0.8)",
          width: "100%",
          color: "white",
        }}
      >
        <h4 className="font-semibold text-sm">{workshop.title}</h4>
        <p className="text-xs text-gray-300">{workshop.instructor}</p>
        <p className="font-bold text-sm mt-1">{workshop.price}</p>
      </div>
      {isHovered === workshop.id && (
        <div style={{
          position: "absolute",
          inset: 0,
          padding: "16px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          opacity: 1,
          zIndex: 10,
          transition: "opacity 0.3s ease-in-out",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}>
          <h4 className="font-semibold text-sm">{workshop.title}</h4>
          <p className="text-xs mt-2">{workshop.instructor} · {workshop.duration}</p>
          <p className="text-xs mt-2">{workshop.description}</p>
          <ul className="text-xs mt-2">
            {workshop.highlights && workshop.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center mt-0">
                <FaCalendarAlt className="mr-1 text-blue-500" /> {highlight}
              </li>
            ))}
          </ul>
          <PaymentHandlerButton
            finalAmt={price(workshop.price)}
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded lg:py-2 sm:py-2"
          />
          <button
            onClick={() => handleMoreInfoClick(workshop.id)}
            className="mt-2 w-full bg-green-500 text-white py-2 rounded lg:py-2 sm:py-2"
          >
            More Info
          </button>
        </div>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-900 text-white">
        <Header />
        <p className="text-xl">Loading workshops...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-900 text-white">
        <Header />
        <p className="text-xl text-red-500">{error}</p>
        <button 
          onClick={fetchWorkshops}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-900 text-black-100 px-4">
      <Header />

      {/* Popular Workshops Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">Popular Workshops</h2>
        <div className="md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularWorkshops.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              isHovered={hoveredPopularWorkshop}
              setHovered={setHoveredPopularWorkshop}
              isPopular={true}
            />
          ))}
        </div>
      </section>

      {/* All Workshops Section */}
      <section>
        <h2 className="text-4xl font-bold mb-8 text-center text-white">All Workshops</h2>
        {workshops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {workshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                isHovered={hoveredAllWorkshop}
                setHovered={setHoveredAllWorkshop}
                isPopular={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No workshops available</p>
        )}
      </section>
    </div>
  )
}

export default Workshops