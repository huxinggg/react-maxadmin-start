
export const menuItemHandle = (menuConfig) => {
    let arr = [...menuConfig]
    let newArr = []
    for(let i=0;i<arr?.length;i++){
      let item = arr[i]
      let children = []
      if(item.children && item.children.length != 0){
        for(let j=0;j<item.children?.length;j++){
          let jitem = item.children[j]
          if(jitem.name){
            children.push({
              key: item.path+jitem.path,
              icon: jitem.icon,
              label: jitem.name,
            })
          }
        }
      }
      if(item.name){
        newArr.push({
          key: item.path,
          icon: item.icon,
          label: item.name,
          children: children.length === 0 ? undefined:children,
        })
      }
    }
    return newArr
}

export const getSuperMenuKey = (menuConfig,path) => {
    let arr = [...menuConfig]
    for(let i=0;i<arr?.length;i++){
      let item = arr[i]
      if(item.children && item.children.length != 0){
        for(let j=0;j<item.children?.length;j++){
          let jitem = item.children[j]
          if(item.path+jitem.path === path){
            return item
          }
        }
      }
    }
}

export const routerHandle = (rsConfig) => {
    let arr = [...rsConfig]
    let newArr = []
    for(let i=0;i<arr?.length;i++){
        let item = arr[i]
        if(item.children && item.children.length != 0){
            for(let j=0;j<item.children?.length;j++){
                let jitem = item.children[j]
                const {path, ...others} = jitem
                newArr.push({path: item.path+path,...others})
            }
        }
        newArr.push(item)
    }
    return newArr
}