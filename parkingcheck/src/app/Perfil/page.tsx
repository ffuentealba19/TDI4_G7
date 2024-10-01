'use client';
import { ImgHTMLAttributes, useState } from "react";

export default function upload(){
    const [file, setFile] = useState(null);
    const [img, setImg] = useState(null);
    return(

            <div>
                    <form onSubmit={async(e) => {
                        e.preventDefault()

                        const form_data= new FormData()

                        form_data.append('file',file)
                        const response = await fetch("/api/Upload", {
                            method: 'POST',
                            body: form_data,
                        })
                        const data = await response.json()
                        console.log(data)
                        

                    }}>
                        <input type="file" onChange={(e) =>{
                        setFile(e.target.files[0]);
                        }}/>
                        <button>
                            Enviar
                        </button>
                    </form>
                    <form onClick={async(e) =>{
                        
                        
                        const respuesta = await fetch("/api/Get_Img", {
                            method: 'GET',
                        })
                        const dataImg = await respuesta.json()
                        console.log(dataImg)
                        setImg(dataImg.ImgUrl)
                    }}>


                    </form>
                    {
                        img && (
                            <img src={img} alt= ""/>
                        )
                    }
                    
            </div>
            

    )
}
