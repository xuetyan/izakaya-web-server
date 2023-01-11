 export interface TableDataInterface_rareCostom {
    mealName: string,
    tagNum: number,
    like: string,
    hate: string,
    material: string,
    cookware: string,
    price: string
 }

 export interface TableDataInterface_normalCostom {
   mealName: string,
   like: string,
   hate: string,
   material: string,
   cookware: string,
   price: string,
   tagCount: number[],
   [propName: string]: any,
 }
 export interface routeTab {
    name: string,
    url: string
 }



