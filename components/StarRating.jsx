'use client'

import { useState } from 'react'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { FiStar } from 'react-icons/fi'

export default function StarRating({ 
  rating = 0, 
  maxRating = 5, 
  size = 20, 
  onRate = null, 
  readOnly = true,
  showLabel = false 
}) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (value) => {
    if (!readOnly && onRate) {
      onRate(value)
    }
  }

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            disabled={readOnly}
            className={`transition ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            title={`Rate ${index} stars`}
          >
            {displayRating >= index ? (
              <FaStar size={size} className="text-gold-500" />
            ) : displayRating >= index - 0.5 ? (
              <FaStarHalfAlt size={size} className="text-gold-500" />
            ) : (
              <FiStar size={size} className="text-gray-300" />
            )}
          </button>
        ))}
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  )
}
