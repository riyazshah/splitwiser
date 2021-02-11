import { useRouter } from 'next/router'
import Layout from '../components/layout'
import styles from './uploadFile.module.css'

export default function UploadFile() {
    const uploadPhoto = async (e) => {
      const file = e.target.files[0];
      const filename = encodeURIComponent(file.name);
      const res = await fetch(`/api/handleFileUpload?file=${filename}`);
      const { url, fields } = await res.json();
      const formData = new FormData();
  
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      const upload = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      
      if (upload.ok) {
        console.log('Uploaded successfully!');
      } else {
        console.error('Upload failed.');
      }

      window.location.replace("/executeTransactions")
    };
  
    return (
        <Layout>
            <h3> Upload File </h3>
            <div class="border uploadFileContainer">
                <div class="uploadFileBox">
                    <p>Upload a pdf file.</p>
                    <input
                        onChange={uploadPhoto}
                        type="file"
                        accept="application/pdf"
                    />
                </div>
            </div> 
        </Layout>
    );
}