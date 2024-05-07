'use client'
import Image from "next/image";

export default function Page() {
    return (
        <div className="flex items-center justify-center h-full">
            <div style={{ maxWidth: '90%', maxHeight: '90%' }}>
                <Image 
                    src="https://http.cat/404" 
                    alt="Error" 
                    layout="responsive" 
                    width={404} 
                    height={404} 
                />
            </div>
        </div>
    );
}

