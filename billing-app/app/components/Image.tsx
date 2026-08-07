import Image from 'next/image'
import Link from 'next/link'
// 1. Import the image file directly
import logoFile from '../app/icon.png'

export default function Logo() {
    return (
        <Link href="/" className="flex items-center">
            <Image
                src={logoFile}        // 2. Use the imported variable, not a string
                alt="Company Logo"
                width={40}
                height={40}
                priority
            />
            <span className="font-bold text-xl ml-2">My Brand</span>
        </Link>
    )
}