import "./posts-page.css";
import PostList from "../../components/posts/PostList"; 
import Sidebar from "../../components/Sidebar/Sidebar";
import Pagination from "../../components/pagination/Pagination";
import { useEffect, useState, useRef } from "react";
import {useDispatch,useSelector} from "react-redux";
import { fetchPosts , getPostsCount} from "../../redux/apiCalls/postApiCall";
import { Application, Assets, Sprite, Container, Rectangle } from 'pixi.js';
import { useLocation } from "react-router-dom";

const POST_PER_PAGE=3;

const PostsPage = () => {
    const dispatch=useDispatch();
    const {postsCount,posts}=useSelector(state=>state.post);
    
    const initializedRef = useRef(false);
    const location=useLocation();

    const[currentPage,setCurrentPage]=useState(1);
    const pages=Math.ceil(postsCount / POST_PER_PAGE);

    useEffect(()=>{
        dispatch(fetchPosts(currentPage));
        window.scrollTo(0,0);
    },[currentPage]);

    useEffect(()=>{
        dispatch(getPostsCount());
    }, []);

    
    useEffect(() => {
        // Check if the effect has already been executed and if the current location is the Home page
        if (!initializedRef.current && location.pathname === '/posts') {
            // Mark the effect as executed
            initializedRef.current = true;

            // Set an item in local storage to indicate that the initialization has happened
            localStorage.setItem('pixiInitialized', 'true');

            // Initialize Pixi.js
            const initializePixiApp = async () => {
                const app = new Application();
                await app.init({ backgroundAlpha: 0, resizeTo: window });
                document.getElementById('header').appendChild(app.canvas);
                const texture = await Assets.load('https://cdn2.iconfinder.com/data/icons/whcompare-servers-web-hosting/50/cdn-512.png');
                const sprite = new Sprite(texture);
                sprite.anchor.set(0.5);
                sprite.x = app.screen.width / 1.2;
                sprite.y = app.screen.height / 6;
                sprite.scale.set(0.3);
                app.stage.addChild(sprite);
                sprite.zIndex = -1;
                app.ticker.add(() => {
                    sprite.rotation += 0.01;
                });
            };

            initializePixiApp();
        }
    }, [location]);

    return ( 
        <>
        <section className="posts-page">
            <PostList posts={posts} />
            <Sidebar/>
        </section>
        <Pagination pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        <div className="header" id="header"></div>
        </>
     );
}
 
export default PostsPage;