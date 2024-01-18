import { useEffect, useState } from "react";
import "./create-post.css";
import {useSelector,useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import { createPost } from "../../redux/apiCalls/postApiCall";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";

const CreatePost = () => {

    const dispatch=useDispatch();
    const {loading,isPostCreated}=useSelector(state=>state.post);   
    const {categories}=useSelector(state=>state.category);

    const [title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const[category,setCategory]=useState("");
    const[file,setFile]=useState(null);

    const formSubmitHandler=(e)=>{
        e.preventDefault();
        if(title.trim()==="") return toast.error("Title is required");
        if(category.trim()==="") return toast.error("Category is required");
        if(description.trim()==="") return toast.error("Description is required");
        if(!file) return toast.error("Image is required");

        const formData=new FormData();
        formData.append("image",file);
        formData.append("title",title);
        formData.append("description",description);
        formData.append("category",category);

        dispatch(createPost(formData));
    };

    const navigate=useNavigate();

    useEffect(()=>{
        if(isPostCreated){
            navigate("/");
        }
    },[isPostCreated,navigate]);

    useEffect(()=>{
        dispatch(fetchCategories());
    },[]);

    return ( 
        <section className="create-post">
            <h1 className="create-post-title">
                Create new post
            </h1>
            <form onSubmit={formSubmitHandler} className="create-post-form" enctype="multipart/form-data">
                <input type="text" placeholder="Post Title" className="create-post-input" 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)}/>
                <select value={category} 
                onChange={(e)=>setCategory(e.target.value)}
                className="create-post-input">
                    <option disabled value="">
                        Select a category
                    </option>
                    {categories.map(category=>
                    <option key={category._id} value={category.title}>
                        {category.title}
                    </option>
                        )}
                </select>
                <textarea className="create-post-textarea" rows="5" placeholder="Post description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                ></textarea>
                <input type="file" name="file" id="file" className="create-post-upload"
                onChange={(e)=>setFile(e.target.files[0])}
                />
                <button type="submit" className="create-post-btn">
                    {
                        loading?"Loading":"Create"
                    }
                </button>
            </form>
        </section>
     );
}
 
export default CreatePost;