import { BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BIBLE_VERSE } from "@/constants";


export default function VerseofTheDay() {
    return (
        <>
            <section className="mb-12">
                <Card className="bg-gradient-to-r from-purple-50 to-gold-50 border-gold-300 py-6 px-4">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <BookOpen className="h-6 w-6 text-purple-700 mr-2" />
                            <CardTitle className="text-purple-800">
                                Verse of the Day
                            </CardTitle>
                        </div>
                        <CardDescription className="text-gold-600">
                            {BIBLE_VERSE.date}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <blockquote className="text-lg md:text-xl italic text-gray-700 mb-4">
                            &quot;{BIBLE_VERSE.verse}&quot;
                        </blockquote>
                        <cite className="text-gold-700 font-semibold">
                            {BIBLE_VERSE.reference}
                        </cite>
                    </CardContent>
                </Card>
            </section>
        </>
    )
}