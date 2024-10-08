import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import './App.css'
export default function App (){
  const [todo, setTodo] = useState('')
  const [category, setCategory] = useState('all')
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth)
  window.addEventListener('resize', ()=>{ 
    if(window.innerWidth<=750 && theme==='dark'){
      document.body.style.backgroundImage = "url('/images/bg-mobile-dark.jpg')"
    }

    if(deviceWidth<=750 && theme==='light'){
      document.body.style.backgroundImage = "url('/images/bg-mobile-light.jpg')"
    }

    if(theme==='dark' && window.innerWidth>750){
      document.body.style.backgroundImage = "url('/images/bg-desktop-dark.jpg')"
    }

    if(theme==='light' && window.innerWidth>750){
      document.body.style.backgroundImage = "url('/images/bg-desktop-light.jpg')"
    }


  })
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
    } 
    if(theme==='light'){
      document.body.style.backgroundColor = 'hsl(0, 0%, 98%)'
      document.body.style.backgroundImage = "url('/images/bg-desktop-light.jpg')"
    }

    if(theme==='dark' && window.innerWidth<=750){
      document.body.style.backgroundColor = 'hsl(235, 21%, 11%)'
      document.body.style.backgroundImage = "url('/images/bg-mobile-dark.jpg')"
    } 

    if(theme==='light'  && window.innerWidth<=750){
      document.body.style.backgroundColor = 'hsl(0, 0%, 98%)'
      document.body.style.backgroundImage = "url('/images/bg-mobile-light.jpg')"
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
  
  function handleCompleted(dex){
    /*for(let i=0; i<todoList.length; i++){
      if(todoList[i]===todoList[index]){
        todoList[i].completed=!todoList[i].completed
        console.log(todoList[i])
        handleEve()
      }
      
    }*///what did i even do here lol
    let newTodoList = todoList.map((todo, index)=>{ //set as completed or not
      if(index === dex){
        return {...todo, completed:!todo.completed}
      }else{
        return todo
        
      }
    })
    setTodoList(newTodoList)
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

  function handleDragDrop(results/*"results" contains information about the drag and drop action*/){
    const {source, destination, type} = results //destructuring the results

    if(!destination){
      return
    }//if theres no destination, return nothing
    if(source.draggableId === destination.draggableId && source.index === destination.index){
      return
    }//if you drag and drop in the same place, also do nothing

    if(type === 'group'/* when the type is set to group, it means the drag and drop action is moving an item within a group or list */){
      const sourceIndex = source.index
      const destinationIndex = destination.index
      /*const reorderedList = [...todoList]
      const [removedItem] = reorderedList.splice(sourceIndex, 1)
      reorderedList.splice(destinationIndex, 0, removedItem)
      setTodoList(reorderedList)*/
      const reorderedList = [...todoList] //creates a copy of the todo list array
      const removedItem = reorderedList[sourceIndex] //item being dragged and dropped
      reorderedList.splice(sourceIndex, 1)//removes the item from its original position
      reorderedList.splice(destinationIndex, 0, removedItem) //inserts the new item at the new position
      setTodoList(reorderedList)//updates todo list
    }


  }

  /*components*/
  function All(){
    return<>
           <Droppable droppableId="ROOT" /*identufies droppable area, ROOT because...ROOT.. */ type="group">
       

        {(provided)=>(//the "provided" object contains all the necessary stuff to set up
           <div  {...provided.droppableProps}/*sets up droppable area */ ref={provided.innerRef} /*provides ref to droppable area */  className={theme==='dark'?"listarea":"listareaWhite"}>
             <ul>
             {todoList.map((todo, index)=>{
                 return <Draggable draggableId={todo.value}/*identifies draggable item */ index={index}>
                   {(provided)=>(
                     <li {...provided.dragHandleProps}/*improves drag handle behaviour */ {...provided.draggableProps}/*sets up draggable item */ ref={provided.innerRef}/*provides ref to draggable item */  key={index} className='todo'>
                     <div className="li"><label><input type="checkbox"  onClick={()=>{handleCompleted(index)}} checked={todo.completed} id='check' />
                     <span style={{color:`${todo.completed===true && theme==='light' && 'hsl(233, 11%, 84%)'}`}}>{todo.value}</span></label></div>
                     <img alt="delete" onClick={()=>{handleDelete(index)}} className="delete" src="/images/icon-cross.svg" />
                     </li>
                   )}
                 </Draggable>
               })}
               {provided.placeholder}
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
        )}
     
  
 
        </Droppable>
    </>
  }

  function Active(){
    return<>
    <Droppable type="group" droppableId="ROOT">    
      {(provided)=>(
        <div {...provided.droppableProps} ref={provided.innerRef} className={theme==='dark'?"listarea":"listareaWhite"}>
        { notComp.length !=0?
          <ul>
          {todoList.map((todo, index)=>{
             if(todo.completed===false){
              return <Draggable draggableId={todo.value} index={index}>
                {(provided)=>(
                  <li {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}
                  key={index} className='todo'>
                   <div className="li"><label><input  onClick={()=>{handleCompleted(index)}} checked={todo.completed} type="checkbox" id='check' /><span>{todo.value}</span></label></div>
                   <img alt="delete" onClick={()=>{handleDelete(index)}} className="delete" src="/images/icon-cross.svg" />
                   </li>
                )}
              </Draggable>
             }
            })}
            {provided.placeholder}
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
      )}
  </Droppable>
    </>
  }

  function Completed(){
    return<>
    <Droppable droppableId="ROOT" type="group">
   {(provided)=>(
      <div {...provided.droppableProps} ref={provided.innerRef} className={theme==='dark'?"listarea":"listareaWhite"}>
      {
        comp.length!=0?<ul draggable>
        {todoList.map((todo, index)=>{
           if(todo.completed===true){
            return <Draggable draggableId={todo.value} index={index}>
              {(provided)=>(
                <li {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}
                key={index} className='todo'>
                 <div className="li"><label><input type="checkbox" onClick={()=>{handleCompleted(index)}} id='check' checked={true} /><s>{todo.value}</s></label></div>
                 <img alt="delete" onClick={()=>{handleDelete(index)}} className="delete" src="/images/icon-cross.svg" />
                 </li>
              )}
            </Draggable>
           }
          })}
          {provided.placeholder}
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
   )}
  </Droppable>
    </>
  }


  /*components*/
  return <>
  <div className="container">
   <div className={theme==='dark'?"firsthalf":"firsthalfWhite"}>
   <div className="top">
   <h1>TODO</h1>
   <img className="themeselector" onClick={()=>{theme==='dark'?setTheme('light'):setTheme('dark')}} src={theme==='dark'?"/images/icon-sun.svg":'/images/icon-moon.svg'} alt="themeselector" />
   </div>
    <div className="text" >
    <input type="checkbox" id='check' checked={false}/>
    <form onSubmit={handleSubmit}>
    <input type="text" placeholder="Create a new todo..."  value={todo} onChange={e=>{setTodo(e.target.value)}} />
    </form>
    </div>
   </div>
   <DragDropContext onDragEnd={handleDragDrop}>
   {
    category==='all'?<All />:category==='active'?<Active />:category==='completed' ?<Completed />:console.log("what'd you press abeg?!")
   }
   </DragDropContext>
   <div className={theme==='dark'?"catsmobile":"catsmobileWhite"}>
      <p style={{ color:`${category==='all' ? 'hsl(220, 98%, 61%)':''}`}} onClick={()=>{setCategory('all')}}>All</p>
      <p style={{ color:`${category==='active' ? 'hsl(220, 98%, 61%)':''}`}} onClick={()=>{setCategory('active')}}>Active</p>
      <p style={{ color:`${category==='completed' ? 'hsl(220, 98%, 61%)':''}`}} onClick={()=>{setCategory('completed')}}>Completed</p>
   </div>
  </div>
 <p className="bottomp">Drag and drop to reorder list.</p>
  </>
}