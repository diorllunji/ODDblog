import { postActions } from "../slices/postSlice";
import request from "../../utils/request";
import {toast} from "react-toastify";

/* Fetch posts based on page number */
export function fetchPosts(pageNumber){
    return async(dispatch)=>{
        try{
            const {data}=await request.get(`/api/posts?pageNumber=${pageNumber}`);
            dispatch(postActions.setPosts(data));
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}


/* Get posts count */
export function getPostsCount(){
    return async(dispatch)=>{
        try{
            const {data}=await request.get(`/api/posts/count`);
            dispatch(postActions.setPostsCount(data));
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}

/* Fetch posts based on category */
export function fetchPostsBasedOnCategory(category){
    return async(dispatch)=>{
        try{
            const {data}=await request.get(`/api/posts?category=${category}`);
            dispatch(postActions.setPostsCate(data));
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}

/* Create Post */
export function createPost(newPost){
    return async(dispatch,getState)=>{
        try{
            dispatch(postActions.setLoading());
            await request.post(`/api/posts`,newPost,{
                headers:{
                    Authorization:"Bearer "+ getState().auth.user.token,
                    "Content-Type":"multipart/form-data"
                }
            });
            dispatch(postActions.setIsPostCreated());
            setTimeout(()=>dispatch(postActions.clearIsPostCreated()),2000);
        }catch(error){
            toast.error(error.response.data.message);
            dispatch(postActions.clearLoading());
        }
    }
}

/* Fetch single post */
export function fetchSinglePost(postId){
    return async(dispatch)=>{
        try{
            const {data}=await request.get(`/api/posts/${postId}`);
            dispatch(postActions.setPost(data));
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}

/* Toggle Like Post*/
export function toggleLikePost(postId){
    return async(dispatch,getState)=>{
        try{
            const {data}=await request.put(`/api/posts/like/${postId}`, {}, {
                headers:{
                    Authorization:"Bearer "+getState().auth.user.token,
                }
            });
            dispatch(postActions.setLike(data));
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}


/* Update post image */
export function updatePostImage(newImage,postId){
    return async(dispatch,getState)=>{
        try{
            await request.put(`/api/posts/update-image/${postId}`,newImage, {
                headers:{
                    Authorization:"Bearer "+ getState().auth.user.token,
                    "Content-Type":"multipart/form-data"
                }
            });
            toast.success("New image uploaded successfully");
        }catch(error){
            toast.error(error.response.data.message);
        }
    };
}

/* Update post */
export function updatePost(newPost,postId){
    return async(dispatch,getState)=>{
        try{
            const {data}=await request.put(`/api/posts/${postId}`,newPost, {
                headers:{
                    Authorization:"Bearer "+ getState().auth.user.token,
                }
            });
           dispatch(postActions.setPost(data));
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}

/* Delete post */
export function deletePost(postId){
    return async(dispatch,getState)=>{
        try{
            const {data}=await request.delete(`/api/posts/${postId}`,{
                headers:{
                    Authorization:"Bearer "+ getState().auth.user.token
                }
            });
           dispatch(postActions.deletePost(data.postId));
           toast.success(data.message);
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}

export function getAllPosts(){
    return async(dispatch)=>{
        try{
            const {data}=await request.get(`/api/posts`);
            dispatch(postActions.setPosts(data));
        }catch(error){
            toast.error(error.response.data.message);
        }
    }
}