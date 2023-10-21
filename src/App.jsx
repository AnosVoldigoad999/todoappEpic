import { useState, useEffect } from "react"
import './App.css'
export default function App (){
  const [todo, setTodo] = useState('')
  const [category, setCategory] = useState('all')
  const [theme, setTheme] = useState(()=>{
    let gottenTheme = JSON.parse(localStorage.getItem('theme'))
    if(!gottenTheme){
      return 'dark'
    } else{
      return gottenTheme
    }
  })

  useEffect(()=>{
    localStorage.setItem('theme', JSON.stringify(theme))
    if(theme==='dark'){
      document.body.style.backgroundColor = 'hsl(235, 21%, 11%)'
      document.body.style.backgroundImage = "url('/images/bg-desktop-dark.jpg')"
    } else{
      document.body.style.backgroundColor = 'hsl(0, 0%, 98%)'
      document.body.style.backgroundImage = "url('/images/bg-desktop-light.jpg')"
    }
  }, [theme])
  const [todoList, setTodoList] = useState(()=>{
    let gottenTodos = JSON.parse(localStorage.getItem('todos'))
    if(!gottenTodos){
      return []
    } else{
      return gottenTodos
    }
  })
  
  const [notComp, setNotComp] = useState(todoList.filter(todo=>todo.completed!=true))
  const [comp, setComp] = useState(todoList.filter(todo=>todo.completed===true))

  function handleEve(){
    setNotComp(todoList.filter(todo=>todo.completed!=true))
    setComp(todoList.filter(todo=>todo.completed===true))
    localStorage.setItem('todos', JSON.stringify(todoList))
  }

  useEffect(()=>{
    handleEve()
    if(todoList.length===0){
      setCategory('all')
    }
  }, [todoList])
  
  function handleCompleted(index){
    for(let i=0; i<todoList.length; i++){
      if(todoList[i]===todoList[index]){
        todoList[i].completed=!todoList[i].completed
        console.log(todoList[i])
        handleEve()
      }
      
    }
  }

  function handleSubmit(e){
    e.preventDefault()
   if(todo){
    setTodoList([...todoList, {value:todo, completed:false}])
    setTodo('')
   }
  }

  function handleDelete(index){
    setTodoList(todoList.filter(todo=>todo!=todoList[index]))
  }


  function handleClear(){
    setTodoList(todoList.filter(todo=>todo.completed!=true))
  }

  /*components*/
  function All(){
    return<>
     <div className={theme==='dark'?"listarea":"listareaWhite"}>
  <ul draggable>
  {todoList.map((todo, index)=>{
      return <li draggable={true} key={index} className='todo'><div className="li"><label><input type="checkbox"  onClick={()=>{handleCompleted(index)}} checked={todo.completed} id='check' />{todo.completed?<s>{todo.value}</s>:<>{todo.value}</>}</label></div><img alt="delete" onClick={()=>{handleDelete(index)}} className="delete" src="public\images\icon-cross.svg" /></li>
    })}
  </ul>
   <div className={theme==='dark'?"footer":"footerWhite"}>
    {notComp.length !=0?<p>{notComp.length} {notComp.length>1?"items":"item"} left</p>:<p>No items left!</p>}
    {todoList.length>0 &&
    <>
    <div className={theme==='dark'?"cats":"catsWhite"}>
      <p  style={{color:'hsl(220, 98%, 61%)'}}>All</p>
      <p onClick={()=>{setCategory('active')}}>Active</p>
      <p onClick={()=>{setCategory('completed')}}>Completed</p>
    </div>
  {comp.length!=0 &&   <p className="clear" onClick={handleClear}>Clear completed</p>}
    </>
    }
  </div>
  </div>
    </>
  }

  function Active(){
    return<>
    <div className={theme==='dark'?"listarea":"listareaWhite"}>
  { notComp.length !=0?
    <ul draggable>
    {todoList.map((todo, index)=>{
       if(todo.completed===false){
        const [check, setCheck] = useState(todo.completed)
        return <li
        key={index} className='todo'>
         <div className="li"><label><input  onClick={()=>{handleCompleted(index)}} checked={check} type="checkbox" id='check' />{!check?<>{todo.value}</>:<s>{todo.value}</s>}</label></div>
         <img alt="delete" onClick={()=>{handleDelete(index)}} className="delete" src="public\images\icon-cross.svg" />
         </li>
       }
      })}
    </ul>:<p style={{fontSize:'0.7rem'}}>None Active!</p>
  }
   <div className={theme==='dark'?"footer":"footerWhite"}>
    {notComp.length !=0?<p>{notComp.length} {notComp.length>1?"items":"item"} left</p>:<p>No items left!</p>}
    {todoList.length>0 &&
    <>
    <div className={theme==='dark'?"cats":"catsWhite"}>
      <p onClick={()=>{setCategory('all')}}>All</p>
      <p style={{color:'hsl(220, 98%, 61%)'}}>Active</p>
      <p onClick={()=>{setCategory('completed')}}>Completed</p>
    </div>
    {comp.length!=0 &&   <p className="clear" onClick={handleClear}>Clear completed</p>}
    </>
    }
  </div>
  </div>
    </>
  }

  function Completed(){
    return<>
     <div className={theme==='dark'?"listarea":"listareaWhite"}>
  {
    comp.length!=0?<ul draggable>
    {todoList.map((todo, index)=>{
       if(todo.completed===true){
        return <li 
        key={index} className='todo'>
         <div className="li"><label><input type="checkbox" onClick={()=>{handleCompleted(index)}} id='check' checked={true} /><s>{todo.value}</s></label></div>
         <img alt="delete" onClick={()=>{handleDelete(index)}} className="delete" src="public\images\icon-cross.svg" />
         </li>
       }
      })}
    </ul>:<p style={{fontSize:'0.7rem'}}>None Completed!</p>
  }
   <div className={theme==='dark'?"footer":"footerWhite"}>
    {notComp.length !=0?<p>{notComp.length} {notComp.length>1?"items":"item"} left</p>:<p>No items left!</p>}
    {todoList.length>0 &&
    <>
    <div className={theme==='dark'?"cats":"catsWhite"}>
      <p onClick={()=>{setCategory('all')}}>All</p>
      <p onClick={()=>{setCategory('active')}}>Active</p>
      <p style={{color:'hsl(220, 98%, 61%)'}}>Completed</p>
    </div>
    {comp.length!=0 &&   <p className="clear" onClick={handleClear}>Clear completed</p>}
    </>
    }
  </div>
  </div>
    </>
  }


  /*components*/

  return <>
  <div className="container">
   <div className={theme==='dark'?"firsthalf":"firsthalfWhite"}>
   <div className="top">
   <h1>TODO</h1>
   <img className="themeselector" onClick={()=>{theme==='dark'?setTheme('light'):setTheme('dark')}} src={theme==='dark'?"/images/icon-sun.svg":'public/images/icon-moon.svg'} alt="themeselector" />
   </div>
    <div className="text" >
    <input type="checkbox" id='check' />
    <form onSubmit={handleSubmit}>
    <input type="text" placeholder="Create a new todo..."  value={todo} onChange={e=>{setTodo(e.target.value)}} />
    </form>
    </div>
   </div>
   {
    category==='all'?<All />:category==='active'?<Active />:category==='completed' ?<Completed />:console.log("what'd you press abeg?!")
   }
  </div>
  </>
}