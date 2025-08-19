import { Metadata } from "next"
import GivePageClient from "./GivePageClient"


export const metadata: Metadata = {
    title: "Give | Holy City of God Christian Fellowship",
    description: "Support Holy City of God Christian Fellowship through secure online giving, Cash App, or mail donations. Your generosity helps us serve Our community and spread God's love.",
    keywords: "donate, giving, tithe, offering, Holy City of God, Christian Fellowship, Detroit, Warren, Michigan",
    openGraph: {
        title: "Give | Holy City of God Christian Fellowship",
        description: "Support our ministry through secure online giving",
        type: "website",
    },
}

export default function GivePage() {
    return <GivePageClient />
}