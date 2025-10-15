import { type NextRequest, NextResponse } from "next/server"
import type { Post } from "@/types"
import { POST_CATEGORIES } from "@/types"

// Sample posts data - same as in main route
const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "Walking in Faith During Difficult Times",
    slug: "walking-in-faith-during-difficult-times",
    excerpt: "Discover how to maintain your faith when life gets challenging and find strength in God's promises.",
    content: `
      <p>Life often presents us with challenges that test our faith and resolve. During these difficult times, it's natural to question, to feel overwhelmed, and to wonder where God is in our struggles.</p>
      
      <h2>Finding Strength in Scripture</h2>
      <p>The Bible is filled with promises and examples of God's faithfulness during trials. Consider the story of Job, who maintained his faith despite losing everything, or David, who found strength in the Lord during his darkest hours.</p>
      
      <h2>Practical Steps for Difficult Times</h2>
      <ul>
        <li>Maintain daily prayer and Bible reading</li>
        <li>Stay connected with your church community</li>
        <li>Remember God's past faithfulness in your life</li>
        <li>Seek counsel from mature believers</li>
      </ul>
      
      <p>Remember, faith isn't the absence of doubt or fear—it's choosing to trust God despite our circumstances. He is with us in every valley and will see us through to victory.</p>
    `,
    featuredImage: "/img/placeholder.jpg?height=300&width=500",
    category: POST_CATEGORIES[0], // Faith
    author: {
      name: "Bishop Anthony King, Sr.",
      role: "Senior Pastor",
      avatar: "/img/King_T_1-min.jpg",
    },
    publishedAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    status: "published",
    tags: ["faith", "trials", "encouragement"],
    readingTime: 5,
    views: 245,
    featured: true,
  },
  {
    id: "2",
    title: "The Power of Community Prayer",
    slug: "the-power-of-community-prayer",
    excerpt: "Learn about the incredible impact of praying together as a church family and community.",
    content: `
      <p>There's something powerful that happens when believers come together in prayer. Jesus himself said, "Where two or three gather in my name, there am I with them" (Matthew 18:20).</p>
      
      <h2>Biblical Foundation</h2>
      <p>Throughout the New Testament, we see examples of the early church praying together. In Acts 2:42, we read that the believers "devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer."</p>
      
      <h2>Benefits of Community Prayer</h2>
      <ul>
        <li>Strengthens church unity and fellowship</li>
        <li>Provides support during difficult times</li>
        <li>Amplifies our prayers before God</li>
        <li>Builds faith through shared testimonies</li>
      </ul>
      
      <p>Join us every Wednesday at 7 PM for our community prayer meeting. Experience the power of united prayer and see how God moves when His people come together.</p>
    `,
    featuredImage: "/img/placeholder.jpg?height=300&width=500",
    category: POST_CATEGORIES[1], // Prayer
    author: {
      name: "Minister Sarah Johnson",
      role: "Prayer Ministry Leader",
    },
    publishedAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    status: "published",
    tags: ["prayer", "community", "fellowship"],
    readingTime: 4,
    views: 189,
  },
  {
    id: "3",
    title: "Serving Others with Love",
    slug: "serving-others-with-love",
    excerpt: "Explore practical ways to serve your community and show God's love through action.",
    content: `
      <p>Jesus came not to be served, but to serve (Mark 10:45). As His followers, we're called to follow His example by serving others with love and compassion.</p>
      
      <h2>The Heart of Service</h2>
      <p>True service comes from a heart transformed by God's love. When we understand how much God has served us through Christ, we're motivated to serve others not out of obligation, but out of gratitude and love.</p>
      
      <h2>Ways to Serve</h2>
      <ul>
        <li>Volunteer at our community food pantry</li>
        <li>Visit elderly members of our congregation</li>
        <li>Participate in neighborhood cleanup events</li>
        <li>Mentor young people in our community</li>
        <li>Support local families in need</li>
      </ul>
      
      <p>Remember, no act of service is too small. Whether it's a smile, a helping hand, or a listening ear, every act of love makes a difference in someone's life.</p>
    `,
    featuredImage: "/img/placeholder.jpg?height=300&width=500",
    category: POST_CATEGORIES[2], // Service
    author: {
      name: "Deacon Michael Brown",
      role: "Community Outreach Director",
    },
    publishedAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    status: "published",
    tags: ["service", "community", "outreach"],
    readingTime: 6,
    views: 156,
  },
  {
    id: "4",
    title: "Preparing Your Heart for Worship",
    slug: "preparing-your-heart-for-worship",
    excerpt: "Discover how to prepare spiritually for meaningful worship experiences.",
    content: `
      <p>Worship is more than singing songs or attending church—it's about connecting with God with our whole heart, mind, and soul.</p>
      
      <h2>Before You Arrive</h2>
      <p>Preparation for worship begins before you enter the sanctuary. Take time during the week to pray, read Scripture, and quiet your heart before God.</p>
      
      <h2>During Worship</h2>
      <ul>
        <li>Focus on God, not distractions</li>
        <li>Participate fully in singing and prayer</li>
        <li>Listen actively to God's Word</li>
        <li>Allow the Holy Spirit to speak to your heart</li>
      </ul>
      
      <p>True worship transforms us. When we come before God with open hearts, He meets us and changes us from the inside out.</p>
    `,
    featuredImage: "/img/placeholder.jpg?height=300&width=500",
    category: POST_CATEGORIES[3], // Worship
    author: {
      name: "Minister David Brown",
      role: "Minister of Music",
    },
    publishedAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    status: "published",
    tags: ["worship", "preparation", "spiritual growth"],
    readingTime: 4,
    views: 203,
  },
  {
    id: "5",
    title: "Building Strong Christian Community",
    slug: "building-strong-christian-community",
    excerpt: "Learn how to foster deeper connections and fellowship within our church family.",
    content: `
      <p>The early church was known for their love and unity. Acts 2:46-47 tells us they met together daily, shared meals, and enjoyed the favor of all people.</p>
      
      <h2>Elements of Strong Community</h2>
      <ul>
        <li>Regular fellowship and shared meals</li>
        <li>Mutual support during trials</li>
        <li>Celebrating victories together</li>
        <li>Accountability and spiritual growth</li>
      </ul>
      
      <p>Community doesn't happen by accident—it requires intentional effort from all of us to reach out, connect, and care for one another.</p>
    `,
    featuredImage: "/img/placeholder.jpg?height=300&width=500",
    category: POST_CATEGORIES[4], // Community
    author: {
      name: "Sister Mary Williams",
      role: "Fellowship Coordinator",
    },
    publishedAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
    status: "published",
    tags: ["community", "fellowship", "unity"],
    readingTime: 3,
    views: 134,
  },
  {
    id: "6",
    title: "Youth Ministry: Raising the Next Generation",
    slug: "youth-ministry-raising-next-generation",
    excerpt: "Discover our commitment to nurturing young people in their faith journey.",
    content: `
      <p>Our youth are not just the church of tomorrow—they are the church of today. We believe in investing in their spiritual growth and leadership development.</p>
      
      <h2>Our Youth Programs</h2>
      <ul>
        <li>Weekly Bible studies and discussions</li>
        <li>Community service projects</li>
        <li>Leadership training opportunities</li>
        <li>Fun activities and fellowship events</li>
      </ul>
      
      <p>Join us every Saturday at 2 PM as we grow together in faith and friendship.</p>
    `,
    featuredImage: "/img/placeholder.jpg?height=300&width=500",
    category: POST_CATEGORIES[5], // Youth
    author: {
      name: "Pastor James Wilson",
      role: "Youth Pastor",
    },
    publishedAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    status: "published",
    tags: ["youth", "ministry", "leadership"],
    readingTime: 4,
    views: 178,
  },
]

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const postIndex = SAMPLE_POSTS.findIndex((p) => p.id === id)

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment view count (in production, this would update the database)
    SAMPLE_POSTS[postIndex].views = (SAMPLE_POSTS[postIndex].views || 0) + 1

    return NextResponse.json({
      message: "View count incremented",
      views: SAMPLE_POSTS[postIndex].views,
    })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 })
  }
}