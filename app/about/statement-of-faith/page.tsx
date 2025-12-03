"use client"

import type React from "react"
import { FadeInView } from "@/components/FadeInView"
import { DropInView } from "@/components/DropInView"
import {
  Heart,
  Cross,
  Zap,
  BookOpen,
  Users,
  Droplets,
  Shield,
  Gift,
  Church,
  Crown,
  ArrowUp,
  Flame,
  UserCheck,
  Home,
  Trophy,
  Star,
  Info,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useContent } from "@/hooks/use-content"

export default function StatementOfFaithPage() {
  const { content, loading } = useContent("statementOfFaith")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading statement of faith...</p>
        </div>
      </div>
    )
  }

  const faithSections = content?.faithSections || [
    {
      title: "God",
      content:
        "We believe in one God, eternally existent in three persons: Father, Son, and Holy Spirit. He is the Creator and Sustainer of all things, perfect in holiness, infinite in wisdom, and boundless in love.",
      verse: '"Hear, O Israel: The Lord our God, the Lord is one." - Deuteronomy 6:4',
      icon: "Crown",
    },
    {
      title: "Jesus Christ",
      content:
        "We believe in the deity of our Lord Jesus Christ, in His virgin birth, in His sinless life, in His miracles, in His vicarious and atoning death through His shed blood, in His bodily resurrection, in His ascension to the right hand of the Father, and in His personal return in power and glory.",
      verse: '"For God so loved the world that he gave his one and only Son..." - John 3:16',
      icon: "Cross",
    },
    {
      title: "Holy Spirit",
      content:
        "We believe in the Holy Spirit as the third person of the Trinity, who convicts the world of sin, regenerates those who believe, and indwells, guides, instructs, and empowers the believer for godly living and service.",
      verse: '"But when he, the Spirit of truth, comes, he will guide you into all the truth." - John 16:13',
      icon: "Flame",
    },
    {
      title: "Scripture",
      content:
        "We believe that the Bible is the Word of God, fully inspired and without error in the original manuscripts, written under the inspiration of the Holy Spirit, and that it has supreme authority in all matters of faith and conduct.",
      verse: '"All Scripture is God-breathed and is useful for teaching..." - 2 Timothy 3:16',
      icon: "BookOpen",
    },
    {
      title: "Mankind",
      content:
        "We believe that man was created in the image of God, that he sinned and thereby incurred not only physical death but also spiritual death, which is separation from God, and that all human beings are born with a sinful nature.",
      verse: '"For all have sinned and fall short of the glory of God." - Romans 3:23',
      icon: "Users",
    },
    {
      title: "The Christian Church",
      content:
        "We believe in the universal church, a living spiritual body of which Christ is the head and all regenerated persons are members. We believe in the local church, consisting of a company of believers in Jesus Christ, baptized on a credible profession of faith, and associated for worship, work, and fellowship.",
      verse: '"And I tell you that you are Peter, and on this rock I will build my church..." - Matthew 16:18',
      icon: "Church",
    },
    {
      title: "Sacraments",
      content:
        "We believe that the Lord Jesus Christ has committed two ordinances to the local church: baptism and the Lord's Supper. We believe that Christian baptism is the immersion of a believer in water into the name of the triune God. We believe that the Lord's Supper was instituted by Christ for commemoration of His death.",
      verse: '"Therefore go and make disciples of all nations, baptizing them..." - Matthew 28:19',
      icon: "Droplets",
    },
    {
      title: "Salvation",
      content:
        "We believe that salvation is the gift of God brought to man by grace and received by personal faith in the Lord Jesus Christ, whose precious blood was shed on Calvary for the forgiveness of our sins.",
      verse: '"For it is by grace you have been saved, through faith..." - Ephesians 2:8-9',
      icon: "Heart",
    },
    {
      title: "Evidence of Salvation",
      content:
        "We believe that all the redeemed, once saved, are kept by God's power and are thus secure in Christ forever. We believe that it is the privilege of believers to rejoice in the assurance of their salvation through the testimony of God's Word.",
      verse: '"I give them eternal life, and they shall never perish..." - John 10:28',
      icon: "UserCheck",
    },
    {
      title: "Justification",
      content:
        "We believe that justification is God's gracious and full acquittal upon principles of His righteousness of all sinners who repent and believe in Christ. Justification brings the believer unto a state of most blessed peace and favor with God.",
      verse: '"Therefore, since we have been justified through faith..." - Romans 5:1',
      icon: "Shield",
    },
    {
      title: "Assurance of Believers",
      content:
        "We believe that all believers have the assurance of their salvation through the work of the Holy Spirit, who bears witness with our spirit that we are children of God. This assurance is based on the promises of God's Word and the finished work of Christ.",
      verse: '"The Spirit himself testifies with our spirit that we are God\'s children." - Romans 8:16',
      icon: "Star",
    },
    {
      title: "Baptism of the Holy Ghost",
      content:
        "We believe that the baptism of the Holy Ghost, according to Acts 2:4, is given to believers who ask for it. We believe that the initial physical evidence of the baptism of the Holy Ghost is speaking with other tongues as the Spirit of God gives utterance.",
      verse: '"All of them were filled with the Holy Spirit and began to speak in other tongues..." - Acts 2:4',
      icon: "Zap",
    },
    {
      title: "The Gifts of the Holy Spirit",
      content:
        "We believe in the gifts of the Holy Spirit as enumerated in 1 Corinthians 12:8-10 and that they are manifestations of the Holy Spirit given to profit the whole body of Christ. We believe that love is more excellent than the greatest gifts.",
      verse: '"Now to each one the manifestation of the Spirit is given for the common good." - 1 Corinthians 12:7',
      icon: "Gift",
    },
    {
      title: "Heterosexual Exclusive Marital Fidelity",
      content:
        "We believe that God has commanded that no intimate sexual activity be engaged in outside of a marriage between a man and a woman. We believe that any form of homosexuality, lesbianism, bisexuality, bestiality, incest, fornication, adultery, and pornography are sinful perversions of God's gift of sex.",
      verse: '"Therefore a man shall leave his father and mother and hold fast to his wife..." - Genesis 2:24',
      icon: "Home",
    },
    {
      title: "Return of Christ",
      content:
        "We believe in the personal, visible, and imminent return of Jesus Christ to earth and the establishment of His kingdom. We believe in the resurrection of both the saved and the lost, the one to everlasting life and the other to everlasting damnation.",
      verse:
        "\"Then I heard a loud voice from the throne saying, 'Look! God's dwelling place is now among the people...'\" - Revelation 21:3",
      icon: "ArrowUp",
    },
    {
      title: "God's Ultimate Victory",
      content:
        "We believe that God will ultimately triumph over all evil and establish His eternal kingdom. We believe in the final judgment, the eternal punishment of the wicked, and the eternal blessedness of the righteous.",
      verse:
        "\"Then I heard a loud voice from the throne saying, 'Look! God's dwelling place is now among the people...'\" - Revelation 21:3",
      icon: "Trophy",
    },
  ]

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      Heart,
      Cross,
      Zap,
      BookOpen,
      Users,
      Droplets,
      Shield,
      Gift,
      Church,
      Crown,
      ArrowUp,
      Flame,
      UserCheck,
      Home,
      Trophy,
      Star,
    }
    return icons[iconName] || Heart
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <DropInView delay={0.2}>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {content?.hero?.title || (
                <>
                  Statement of <span className="text-secondary-500">Faith</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content?.hero?.subtitle ||
                "Our foundational beliefs and doctrinal positions that guide our fellowship and ministry"}
            </p>
          </div>
        </DropInView>

        {/* Faith Sections */}
        <div className="space-y-12">
          {faithSections.map(
            (section: { title: string; content: string; verse: string; icon: string }, index: number) => {
              const IconComponent = getIcon(section.icon)
              return (
                <FadeInView key={section.title} delay={0.3 + index * 0.1}>
                  <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
                    <div className="flex items-start space-x-4">
                      <div className="bg-secondary-100 p-3 rounded-full">
                        <IconComponent className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">{section.content}</p>
                        <p className="text-sm text-secondary italic">{section.verse}</p>
                      </div>
                    </div>
                  </div>
                </FadeInView>
              )
            },
          )}
        </div>

        {/* Chicago Statement Section */}
        <FadeInView delay={1.9}>
          <div className="mt-16 bg-secondary-50 rounded-lg p-8 border border-secondary-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {content?.chicagoStatement?.title || "Chicago Statement on Biblical Inerrancy"}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {content?.chicagoStatement?.content ||
                "We affirm the Chicago Statement on Biblical Inerrancy as a faithful summary of what the Scriptures teach about their own nature and authority. This statement affirms that Scripture is without error or fault in all its teaching, no less in what it states about God's acts in creation, about the events of world history, and about its own literary origins under God, than in its witness to God's saving grace in individual lives."}
            </p>
          </div>
        </FadeInView>

        {/* What do we mean by inerrant? Section */}
        <FadeInView delay={2.0}>
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {content?.inerrantSection?.title || content?.inerrancy?.title || (
                <>
                  What do we mean by <span className="text-secondary-500">inerrant</span>?
                </>
              )}
            </h2>

            <div className="space-y-8">
              {(
                content?.inerrantSection?.quotes ||
                content?.inerrancy?.quotes || [
                  {
                    quote:
                      "The Bible is true and therefore trustworthy. This is what we mean when we say that the Bible is inerrant. It contains no mistakes. It can be trusted completely.",
                    author: "John Piper",
                  },
                  {
                    quote:
                      "The Scriptures possess the quality of freedom from error. They are exempt from the liability to mistake, incapable of error. In all their teachings they are in perfect accord with the truth.",
                    author: "E.J. Young",
                  },
                  {
                    quote:
                      "The inerrancy of Scripture means that Scripture in the original manuscripts does not affirm anything that is contrary to fact.",
                    author: "Wayne Grudem",
                  },
                ]
              ).map((quote: { quote?: string; text?: string; author: string }, index: number) => (
                <div key={index} className="border-l-4 border-secondary-500 pl-6">
                  <p className="text-gray-700 leading-relaxed italic mb-2">&quot;{quote.quote || quote.text}&quot;</p>
                  <p className="text-sm text-secondary font-semibold">- {quote.author}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInView>

        {/* Back to About */}
        <FadeInView delay={2.1}>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-300 mt-8 shadow-lg hover:bg-gold-300 font-semibold hover:text-purple-700 hover-lift bg-transparent"
            >
              <Info className="mr-2 h-5 w-5" />
              Back to About
            </Button>
          </Link>
        </FadeInView>
      </div>
    </div>
  )
}