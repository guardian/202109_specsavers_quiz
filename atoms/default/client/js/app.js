// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import { render, h, Fragment, createContext } from "preact";
import SocialBar from 'shared/js/SocialShare';
import {$, $$} from 'shared/js/util';
import RelatedContent from "shared/js/RelatedContent";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Body from "./Body";
import store, { ACTION_SET_SECTIONS, fetchData, assetsPath, ACTION_SET_VIEW, ACTION_SET_SCORE } from "./store";
import {SwitchTransition, Transition, TransitionGroup} from "react-transition-group";
import { IconBackArrow, IconCabin, IconSkyactive, IconSound, IconStyle, IconSustainable, Logo, ScrollDown, IconExplore, IconHome, IconFba, IconFbb, IconFbc, IconFbd, IconRestart, IconBack, IconNext, IconStart} from "./Icons";
import {Provider, useSelector, useDispatch} from "react-redux";
import { useEffect, useRef, useState } from "preact/hooks";
import HoverButton from "./HoverButton";

let dispatch;

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
    duration: 0.8,
    ease: 'sine.inOut'
});

const setHtml = (html) => ({__html: html});

const scrollToTop = () => {
    const t = document.getElementById('feature-top');
    // if (Math.abs(t - window.scrollY) < 200) {
    //     return false;
    // } 
    t.scrollIntoView({
        behavior: 'smooth'
    });
    return false;
}

const Container = ({children}) => {
    return (
        <div className="md:container  md:mx-auto">
            {children}
        </div>
    )
}
// const FlexContainer = (props) => {
const FlexContainer = ({children, className}) => {
    return (
        <div className={`flex-container ${className}`} >
            {children}
        </div>
    )
}


const Loading = () => 
    <FlexContainer className="loading">
        <div style={{width: 300}}>
            <img src={`${assetsPath}/glab_logo.svg`} />
        </div>
    </FlexContainer>


const Attribution = ({content}) => {
    return (
        <div className="attribution">
            <p>Paid for by 
                <a href={content.logoLink} target="_blank">
                    <Logo />
                </a>
            </p>
        </div>
    )
}

const ClientHubLink = ({children, href = '#'}) => 
    <div className="client-hub-link">
        <a href={href} target="_blank">{children}</a>
    </div>

const Header = () => {
    const content = useSelector(s=>s.content);

    return (
        <div>
            <div className="header relative">
                <Attribution content={content} />
            </div>
        </div>        
    )
}

const Footer = ({content, related, shareUrl}) => {

    return (
        <Fragment>

            <section className="footer dark-text px-2">
                <div className="content">
                    <div className="cta-wrap">
                        <div className="cta" dangerouslySetInnerHTML={setHtml(content.cta)} />
                        <div className="share">
                            <SocialBar title={content.shareTitle} url={shareUrl} />
                        </div>
                    </div>
                    
                </div>
            </section>

            <section className="related p-8">
                    <div className="mx-auto" >
                        <h3>Related content</h3>
                        <RelatedContent cards={related} />
                    </div>
            </section>
        </Fragment>
    )
}

const Standfirst = ({content}) => {

    return (
        <div className="standfirst">
                <div className="content" dangerouslySetInnerHTML={setHtml(content.standfirst)}></div>
        </div>
    )
}
const SmoothScroll = ({children}) => {
    const app = useRef();
    const [pos, setPos] = useState(window.scrollY);
    useEffect(()=>{
        window.addEventListener('scroll', (e) => {
            e.preventDefault();
            const dy = pos-window.scrollY;
            console.log(Math.max(-2100, dy));
            setPos(window.scrollY);
            gsap.to(app.current, {duration: 0.5, y: Math.max(-2100, dy), ease: 'sine.out'});
        });
    },[])
    return (
        <div ref={app}>
            {children}
        </div>
    )
}

const FeatureImage = ({src}) => {
    return (
        <img className="feature-image" src={src} />
    )
}

const DefaultPanel = (props) => {
    const view = useSelector(s=>s.UI.view);

    return (
        <div className={`panel-default ${props.className} view-${view}`} >
            <div className="body max-w-md m-auto">
                {props.children}

            </div>
        </div>
    )
}

const HomePanel = (props) => {
    const globalData = useSelector(s=>s.content);
    const data = useSelector(s=>s.content.sections.home);

    const handleClick = (e) => {
        e.preventDefault();
        dispatch({type:ACTION_SET_VIEW, payload: 'quiz'})
    }
    return (
        <DefaultPanel>
            <div className="header">
                <Attribution content={globalData} />

            </div>
            <IconHome />
            <h1>{globalData.headline}</h1>
            <div dangerouslySetInnerHTML={setHtml(data.content)} />
            <a href="#" class="btn" onClick={handleClick}>{globalData.start}  <IconStart /></a>
        </DefaultPanel>
    )
}


const FeedbackPanel = (props) => {
    const globalData = useSelector(s=>s.content);
    const data = useSelector(s=>s.content.sections);
    const questions = useSelector(s=>s.sheets.questions);
    const score = useSelector(s=>s.UI.score);
    const [fb, setFB] = useState({});
    const [featImage, setImage] = useState(null);

    const handleClick = (e) => {
        e.preventDefault();
        dispatch({type:ACTION_SET_VIEW, payload: 'quiz'})
    }

    useEffect(()=>{
        if (score > 7) {
            setFB(data.fba);
            setImage(h(IconFba));
        } else if (score > 5) {
            setFB(data.fbb);
            setImage(h(IconFbb));
        } else if (score > 3) {
            setFB(data.fbc);
            setImage(h(IconFbc));
        } else {
            setFB(data.fbd);
            setImage(h(IconFbd));
        }
    },[]);

    return (
        <DefaultPanel>
            <div className="score">
                <h3 className="text-center"> You scored {Math.round((score / questions.length) * 100) }</h3>
            </div>

            {featImage}
            
            <h1>{fb.heading}</h1>
            <div dangerouslySetInnerHTML={setHtml(fb.content)} />
            <a href="#" class="btn" onClick={handleClick}>{globalData.retry}  <IconRestart /></a>
        </DefaultPanel>
    )
}

const QuizContext = createContext();

const QuizRadioButton = (props) => {
    const [checked, setChecked] = useState(false);
    const handleOnChange = (e) => {
        setChecked(s=>!s);
        props.onSelect(e);
    }
    return (
        <Fragment>
                <input checked={props.checked == props.value} type="radio" name={`qop`} id={`qop${props.count}`} value={props.value} onChange={handleOnChange} disabled={props.disabled} />
                <label className={props.ca? 'ca' : ''} for={`qop${props.count}`}>{props.label}</label>            
        </Fragment>
    )
    return (
        <Transition
        in={props.ca}
        key={props.label}
        timeout={2000}
        onEnter={n=>gsap.from(n,{duration:1, delay:0.5, alpha: 0})}
        // onExit={n=>gsap.to(n,{duration:1, alpha:0})}
        onExit={n=>console.log('exitting')}
        mountOnEnter
        unmountOnExit
        appear={true}
        >
            <div>
                <input checked={props.checked == props.value} type="radio" name={`qop`} id={`qop${props.count}`} value={props.value} onChange={handleOnChange} disabled={props.disabled} />
                <label className={props.ca? 'ca' : ''} for={`qop${props.count}`}>{props.label}</label>
            </div>
        </Transition>
    )
}

const QuestionOptions = ({className, onSelect, disabled}) => {
    const [checked, setChecked] = useState(null);

    const handleOnChange = (e) => {
        setChecked(e.target.value)
        onSelect(e);
    }


    const ops = (question) => {
        const qid = question.key;
        const options = question.options.split('||');
        // const checked = (new Array(options.length).fill(false));

        return options.map((v, i) => 
            <QuizRadioButton checked={checked} ca={question.ca == (i+1)} count={i} value={i+1} label={v} onSelect={handleOnChange} disabled={disabled} />
        )
    };


    return (
        <QuizContext.Consumer>
            {data=> {

                useEffect(()=>{
                    setChecked(null)
                    // gsap.from('.question-options label', {duration:.6, stagger:0.05, y: 30, alpha: 0, ease:'expo.out'});
                },[data])
                return (
                    <SwitchTransition>
                    <Transition
        key={data}
        timeout={1000}
        onEnter={n=>gsap.from(n.querySelectorAll('label'),{duration:0.5, y: 30, stagger: 0.05, alpha:0, rotateY: -20, ease: 'expo.out'})}
        onExit={n=>{gsap.to(n.querySelectorAll('label'),{duration:0.3, y: 10, stagger: 0.05, alpha:0, ease: 'expo.in'})}}
        // onExit={n=>console.log('exitting')}
        mountOnEnter
        appear={true}
        >  
                    <div className={`question-options ${className}`}>
                        {ops(data)}
                    </div>
                    </Transition>
                    </SwitchTransition>
                )
            }}
        </QuizContext.Consumer>
    )
    return ops();
}


const QuizNav = ({qList, onSelect}) => {
    return(
        <QuizContext.Consumer>
            {q => {
                const navList = () => {
                    return qList.map( (v, i) => 
                        <li className={i+1==q.id?'active':''}><a aria-role="button" href="#" title={`Question ${i+1}`} onClick={(e)=>{e.preventDefault();onSelect(i)}}>•</a></li>
                    )
                }
                return (
                    <nav className="quiz-nav">
                        <a href="# " title="Previous question" className="prev" onClick={(e)=>{e.preventDefault();onSelect(parseInt(q.id)-2)}}><IconBack /></a>
                        <ul className="inline">
                            { navList() }
                        </ul>
                        <a href="#" title="Next question" className="next" onClick={(e)=>{e.preventDefault();onSelect(parseInt(q.id))}}><IconNext /></a>
                    </nav>
                )
            }}
        </QuizContext.Consumer>
    )
}

window.gsap = gsap;

const QuizPanel = (props) => {
    const data = useSelector(s=>s.sheets.questions);
    const [question, setQ] = useState(0);
    const [qState, setQstate] = useState(new Array(data.length).fill(0));
    const [score, setScore] = useState(0);
    const [ca, setCa] = useState(false);
    const points = 100/data.length;

    useEffect(()=>{
       setTimeout(() => {
           const h = document.querySelector('.question-body');
           console.log(h.offsetHeight)
           h.style.minHeight = `${h.offsetHeight}px`;
       }, 500);
    },[])

    const onSelectOption = (e) => {
        if (data[question].ca == e.target.value) {
            setQstate(s=> {
                s[question] = 1
                return [...s];
            })
            setScore(qState.reduce((p,c)=>p+c,0));
        }
        setCa(true);
    }

    const showQuestion = (id) => {
        if (id >= data.length) {
            dispatch({type:ACTION_SET_SCORE, payload: score});
            dispatch({type:ACTION_SET_VIEW, payload:'feedback'});
            return;
        }
        if (id >= 0) {
            setQ(id);
            setCa(false);
        }
    }

    return (
        <DefaultPanel className="quiz-panel">

            
        
            <QuizContext.Provider value={data[question]}>
                <div className="score">
                    Your score
                    <div>{Math.round((score / data.length) * 100) }</div>
                </div>
                <div className="question-body">
                    <SwitchTransition>
                        <Transition
                            key={question}
                            timeout={400}
                            onEnter={n=>gsap.from(n,{duration:0.5, scale: 1.3, alpha: 0})}
                            onExit={n=>{gsap.to(n,{duration:0.5, scale: .7, alpha:0})}}
                            // onExit={n=>console.log('exitting')}
                            mountOnEnter
                            // unmountOnExit
                            appear={true}
                            >
                                <FeatureImage src={`${assetsPath}/q${question+1}.svg`} />
                        </Transition>
                    </SwitchTransition>
                

                    <SwitchTransition>
                    <Transition
                        key={question}
                        timeout={1000}
                        onEnter={n=>gsap.from(n,{duration:0.5, alpha: 0})}
                        onExit={n=>{gsap.to(n,{duration:0.1, alpha:0})}}
                        // onExit={n=>console.log('exitting')}
                        mountOnEnter
                        appear={true}
                        >
                            <div className="question-text" dangerouslySetInnerHTML={setHtml(data[question].questionText)}>
                                
                            </div>
                    </Transition>
                    </SwitchTransition>
              
                    <QuestionOptions onSelect={onSelectOption} className={ca? 'complete': ''} disabled={ca} />
                </div>

                {<SwitchTransition>
                    <Transition
                        // in={ca}
                        // key={question}
                        key={ca}
                        timeout={300}
                        onEnter={n=>{console.log(n),gsap.from(n,{duration:2, alpha: 0, ease: 'expo.inOut', height: 0, transformOrigin: "50% 100%", y: -30})}}
                        onExit={n=>{console.log(n),gsap.to(n,{duration:0.3, alpha:0})}}
                        // onExit={n=>console.log('exitting')}
                        // unmountOnExit
                        // appear={true}
                        >
                                {ca && <div className="fb" dangerouslySetInnerHTML={setHtml(data[question].fbca)}></div>}
                            {!ca && <div className='fb'></div>}

                    </Transition>                
                    </SwitchTransition>
                }

                <QuizNav qList={data} onSelect={showQuestion} />

            </QuizContext.Provider>
        </DefaultPanel>
    )
}

const Break = () => <div className="break"><span></span><span></span><span></span></div>;

const MainBody = ({children}) => {

    return (
        <div className="main">
            {children}
        </div>
    )
}


const Main = () => {
    const loaded = useSelector(s=>s.dataLoaded);
    
    // const dispatch = useDispatch();

    dispatch = useDispatch();

    useEffect(()=>{
        dispatch( fetchData('https://interactive.guim.co.uk/docsdata/1Yc_vSxYxSatLCvwQ-jCI0HqahWuFMcBB5zEGXLoQCGI.json') );
    },[]);


    

    const content = useSelector(s=>s.content);
    const uiView = useSelector(s=>s.UI.view);

    const store = useSelector(s=>s);    

    const getCurrentView = () => {
        switch (uiView) {
            case 'home':
                return <HomePanel />;
            case 'feedback':
                return <FeedbackPanel />;
                default:
                    return <QuizPanel />;
        }
    }
    
    if (!loaded) return <Loading />;
 


    return (
        <SwitchTransition>
            <Transition
                key={loaded}
                timeout={1000}
                onEnter={n=>gsap.from(n,{alpha: 0})}
                onExit={n=>gsap.to(n,{alpha:0})}
                mountOnEnter
                unmountOnExit
                appear={true}
            >
                {!loaded && <Loading />}
                {loaded &&
                    
                    <MainBody>

                            <div className="feature-container">

                            
                            <SwitchTransition>
                                <Transition
                                    key={uiView}
                                    timeout={1000}
                                    onEnter={n=>gsap.from(n,{duration:.5, alpha: 0})}
                                    onExit={n=>gsap.to(n,{duration:0.5, alpha:0})}
                                    mountOnEnter
                                    unmountOnExit
                                    appear={true}
                                    >
                                        {getCurrentView()}
                                    </Transition>
                            </SwitchTransition>
                            </div>
                            <Break />
                            <Footer content={content} related={store.sheets.related} shareUrl={store.sheets.global[0].shareUrl} />
                        </MainBody>
                }
            </Transition>            
        </SwitchTransition>
    )
}


const App = () => {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>

    )
}

render( <App/>, document.getElementById('Glabs'));

