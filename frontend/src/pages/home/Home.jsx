import PostList from "../../components/posts/PostList";
import "./home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import {Link, useLocation} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import { useEffect, useState,useRef } from "react";
import { fetchPosts } from "../../redux/apiCalls/postApiCall";
import { Application, Assets, Sprite, Container, Rectangle } from 'pixi.js';

const Home = () => {
    const dispatch=useDispatch();
    const {posts}=useSelector(state=>state.post);
    const initializedRef = useRef(false);
    const location=useLocation();

    useEffect(()=>{
        dispatch(fetchPosts(1));
    });

    useEffect(() => {
        // Check if the effect has already been executed and if the current location is the Home page
        if (!initializedRef.current && location.pathname === '/') {
            initializedRef.current = true;

            const initializePixiApp = async () => {
                const app = new Application();
                await app.init({ backgroundAlpha: 0, resizeTo: window });
                document.body.appendChild(app.canvas);
                const texture = await Assets.load('https://cdn-icons-png.flaticon.com/512/10290/10290328.png');
                const bunny = new Sprite(texture);
                bunny.anchor.set(0.5);
                bunny.x = app.screen.width / 2;
                bunny.y = app.screen.height / 2;
                app.stage.addChild(bunny);
                bunny.zIndex = -1;
                app.ticker.add(() => {
                    bunny.rotation += 0.01;
                });
            };

            initializePixiApp();
        }
    }, [location]); 
    

    return ( 
        
    <section className="home">
        <div className="home-hero-header">
            <div className="home-hero-header-layout">
                <h1 className="home-title">ODDBlog</h1>
            </div>
        </div>
        <div className="home-latest-post">Latest Posts</div>
        <div className="home-container">
            <PostList posts={posts} />
            <Sidebar  />
        </div>
        <div className="home-see-posts-link">
            <Link to="/posts" className="home-link">
                See all posts
            </Link>
        </div>
    </section> 

    );
}


export default Home;