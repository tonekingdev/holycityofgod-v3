import Image from "next/image";


export default function FormImage() {
    return (
        <div className="relative h-20 w-20 bg-white rounded-full p-2 shadow-md">
            <Image 
                src="/img/church-logo.png"
                alt="Holy City of God Christian Fellowship"
                width={80}
                height={80}
                className="object-cover"
            />
        </div>
    )
}