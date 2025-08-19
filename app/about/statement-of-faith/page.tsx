import type { Metadata } from "next"
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

export const metadata: Metadata = {
  title: "Statement of Faith | Holy City of God Christian Fellowship",
  description:
    "Our comprehensive statement of faith outlining our core beliefs and doctrinal positions as a Christian fellowship.",
}

export default function StatementOfFaithPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <DropInView delay={0.2}>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Statement of <span className="text-secondary-500">Faith</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our foundational beliefs and doctrinal positions that guide our fellowship and ministry
            </p>
          </div>
        </DropInView>

        {/* Faith Sections */}
        <div className="space-y-12">
          {/* 1. God */}
          <FadeInView delay={0.3}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Crown className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">God</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe in one God, eternally existent in three persons: Father, Son, and Holy Spirit. He is the
                    Creator and Sustainer of all things, perfect in holiness, infinite in wisdom, and boundless in love.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;Hear, O Israel: The Lord our God, the Lord is one.&quot; - Deuteronomy 6:4
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 2. Jesus Christ */}
          <FadeInView delay={0.4}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Cross className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Jesus Christ</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe in the deity of our Lord Jesus Christ, in His virgin birth, in His sinless life, in His
                    miracles, in His vicarious and atoning death through His shed blood, in His bodily resurrection, in
                    His ascension to the right hand of the Father, and in His personal return in power and glory.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;For God so loved the world that he gave his one and only Son...&quot; - John 3:16
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 3. Holy Spirit */}
          <FadeInView delay={0.5}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Flame className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Holy Spirit</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe in the Holy Spirit as the third person of the Trinity, who convicts the world of sin,
                    regenerates those who believe, and indwells, guides, instructs, and empowers the believer for godly
                    living and service.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;But when he, the Spirit of truth, comes, he will guide you into all the truth.&quot; - John 16:13
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 4. Scripture */}
          <FadeInView delay={0.6}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Scripture</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that the Bible is the Word of God, fully inspired and without error in the original
                    manuscripts, written under the inspiration of the Holy Spirit, and that it has supreme authority in
                    all matters of faith and conduct.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;All Scripture is God-breathed and is useful for teaching...&quot; - 2 Timothy 3:16
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 5. Mankind */}
          <FadeInView delay={0.7}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Mankind</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that man was created in the image of God, that he sinned and thereby incurred not only
                    physical death but also spiritual death, which is separation from God, and that all human beings are
                    born with a sinful nature.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;For all have sinned and fall short of the glory of God.&quot; - Romans 3:23
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 6. The Christian Church */}
          <FadeInView delay={0.8}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Church className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">The Christian Church</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe in the universal church, a living spiritual body of which Christ is the head and all
                    regenerated persons are members. We believe in the local church, consisting of a company of
                    believers in Jesus Christ, baptized on a credible profession of faith, and associated for worship,
                    work, and fellowship.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;And I tell you that you are Peter, and on this rock I will build my church...&quot; - Matthew 16:18
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 7. Sacraments */}
          <FadeInView delay={0.9}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Droplets className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sacraments</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that the Lord Jesus Christ has committed two ordinances to the local church: baptism and
                    the Lord&apos;s Supper. We believe that Christian baptism is the immersion of a believer in water into
                    the name of the triune God. We believe that the Lord&apos;s Supper was instituted by Christ for
                    commemoration of His death.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;Therefore go and make disciples of all nations, baptizing them...&quot; - Matthew 28:19
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 8. Salvation */}
          <FadeInView delay={1.0}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Salvation</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that salvation is the gift of God brought to man by grace and received by personal faith
                    in the Lord Jesus Christ, whose precious blood was shed on Calvary for the forgiveness of our sins.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;For it is by grace you have been saved, through faith...&quot; - Ephesians 2:8-9
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 9. Evidence of Salvation */}
          <FadeInView delay={1.1}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Evidence of Salvation</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that all the redeemed, once saved, are kept by God&apos;s power and are thus secure in Christ
                    forever. We believe that it is the privilege of believers to rejoice in the assurance of their
                    salvation through the testimony of God&apos;s Word.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;I give them eternal life, and they shall never perish...&quot; - John 10:28
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 10. Justification */}
          <FadeInView delay={1.2}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Justification</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that justification is God&apos;s gracious and full acquittal upon principles of His
                    righteousness of all sinners who repent and believe in Christ. Justification brings the believer
                    unto a state of most blessed peace and favor with God.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;Therefore, since we have been justified through faith...&quot; - Romans 5:1
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 11. Assurance of Believers */}
          <FadeInView delay={1.3}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Assurance of Believers</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that all believers have the assurance of their salvation through the work of the Holy
                    Spirit, who bears witness with our spirit that we are children of God. This assurance is based on
                    the promises of God&apos;s Word and the finished work of Christ.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;The Spirit himself testifies with our spirit that we are God&apos;s children.&quot; - Romans 8:16
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 12. Baptism of the Holy Ghost */}
          <FadeInView delay={1.4}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Baptism of the Holy Ghost</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that the baptism of the Holy Ghost, according to Acts 2:4, is given to believers who ask
                    for it. We believe that the initial physical evidence of the baptism of the Holy Ghost is speaking
                    with other tongues as the Spirit of God gives utterance.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;All of them were filled with the Holy Spirit and began to speak in other tongues...&quot; - Acts 2:4
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 13. The Gifts of the Holy Spirit */}
          <FadeInView delay={1.5}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">The Gifts of the Holy Spirit</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe in the gifts of the Holy Spirit as enumerated in 1 Corinthians 12:8-10 and that they are
                    manifestations of the Holy Spirit given to profit the whole body of Christ. We believe that love is
                    more excellent than the greatest gifts.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;Now to each one the manifestation of the Spirit is given for the common good.&quot; - 1 Corinthians 12:7
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 14. Heterosexual Exclusive Marital Fidelity */}
          <FadeInView delay={1.6}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Home className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Heterosexual Exclusive Marital Fidelity</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that God has commanded that no intimate sexual activity be engaged in outside of a
                    marriage between a man and a woman. We believe that any form of homosexuality, lesbianism,
                    bisexuality, bestiality, incest, fornication, adultery, and pornography are sinful perversions of
                    God&apos;s gift of sex.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;Therefore a man shall leave his father and mother and hold fast to his wife...&quot; - Genesis 2:24
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 15. Return of Christ */}
          <FadeInView delay={1.7}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <ArrowUp className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Return of Christ</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe in the personal, visible, and imminent return of Jesus Christ to earth and the
                    establishment of His kingdom. We believe in the resurrection of both the saved and the lost, the one
                    to everlasting life and the other to everlasting damnation.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;This same Jesus, who has been taken from you into heaven, will come back...&quot; - Acts 1:11
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* 16. God's Ultimate Victory */}
          <FadeInView delay={1.8}>
            <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-secondary-500">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary-100 p-3 rounded-full">
                  <Trophy className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">God&apos;s Ultimate Victory</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that God will ultimately triumph over all evil and establish His eternal kingdom. We
                    believe in the final judgment, the eternal punishment of the wicked, and the eternal blessedness of
                    the righteous.
                  </p>
                  <p className="text-sm text-secondary-600 italic">
                    &quot;Then I heard a loud voice from the throne saying, &apos;Look! God&apos;s dwelling place is now among the
                    people...&apos;&quot; - Revelation 21:3
                  </p>
                </div>
              </div>
            </div>
          </FadeInView>
        </div>

        {/* Chicago Statement Section */}
        <FadeInView delay={1.9}>
          <div className="mt-16 bg-secondary-50 rounded-lg p-8 border border-secondary-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Chicago Statement on Biblical Inerrancy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We affirm the Chicago Statement on Biblical Inerrancy as a faithful summary of what the Scriptures teach
              about their own nature and authority. This statement affirms that Scripture is without error or fault in
              all its teaching, no less in what it states about God&apos;s acts in creation, about the events of world
              history, and about its own literary origins under God, than in its witness to God&apos;s saving grace in
              individual lives.
            </p>
          </div>
        </FadeInView>

        {/* What do we mean by inerrant? Section */}
        <FadeInView delay={2.0}>
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              What do we mean by <span className="text-secondary-500">inerrant</span>?
            </h2>

            <div className="space-y-8">
              <div className="border-l-4 border-secondary-500 pl-6">
                <p className="text-gray-700 leading-relaxed italic mb-2">
                  &quot;The Bible is true and therefore trustworthy. This is what we mean when we say that the Bible is
                  inerrant. It contains no mistakes. It can be trusted completely.&quot;
                </p>
                <p className="text-sm text-secondary-600 font-semibold">- John Piper</p>
              </div>

              <div className="border-l-4 border-secondary-500 pl-6">
                <p className="text-gray-700 leading-relaxed italic mb-2">
                  &quot;The Scriptures possess the quality of freedom from error. They are exempt from the liability to
                  mistake, incapable of error. In all their teachings they are in perfect accord with the truth.&quot;
                </p>
                <p className="text-sm text-secondary-600 font-semibold">- E.J. Young</p>
              </div>

              <div className="border-l-4 border-secondary-500 pl-6">
                <p className="text-gray-700 leading-relaxed italic mb-2">
                  &quot;The inerrancy of Scripture means that Scripture in the original manuscripts does not affirm anything
                  that is contrary to fact.&quot;
                </p>
                <p className="text-sm text-secondary-600 font-semibold">- Wayne Grudem</p>
              </div>
            </div>
          </div>
        </FadeInView>

        <FadeInView>
          <Link href="/about">
              <Button size="lg" variant="outline" className="border-purple-300 mt-4 shadow-lg hover:bg-gold-300 font-semibold hover:text-purple-700 hover-lift">
                <Info className="mr-2 h-5 w-5" />
                Back to About
              </Button>
          </Link>
        </FadeInView>
      </div>
    </div>
  )
}