import Handlebars from "handlebars";
import * as fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToPdf =__dirname.concat("\\pdf")


const style = (css) => `<style>${css}</style>`
const emptyCss = `<style></style>`


  /**

   * @author Gabriel Oliveira
   * @version 0.1
   * @params source -> name of the component, used to track where the files is and create the variable to be inserted in the parent component.
   * @params dataSource -> data that its going to be inserted in the component
   * @params comps -> childrens Object list, following the the type: {name: string, component: htmlComponent}
   * @returns  -> component in a htlm format.
   */
function createHTMLComponent (source, dataSource = {}, comps = [])  {
    if(source == '') {
        return
    }
    if(Array.isArray(dataSource)){
        dataSource[source+'Value'] = dataSource
        dataSource[source+'Key'] = dataSource.map((el) => {
            return Object.keys(el)
        })[0]
    }else {
        const keyValues = Object.entries(dataSource)
        keyValues.forEach((el) => {
            if(Array.isArray(el[1])){
                dataSource[el[0]+'Value'] = el[1]
                dataSource[el[0]+'Key'] = el[1].map((x) => {
                    return Object.keys(x)
                })[0]
            }
        })
        
    }

    const htmlPath = `${pathToPdf}\\${source}\\${source}.html`
    const cssPath = `${pathToPdf}\\${source}\\${source}.css`
    
    const cssSource = fs.readFileSync(cssPath, 'utf-8').toString();
    const htmlSource = fs.readFileSync(htmlPath, 'utf-8').toString();
    
    const finalCode = emptyCss !== style(cssSource) ? htmlSource.concat(style(cssSource)) : htmlSource
    
    comps.forEach((component) => {
        const subComponent = Handlebars.compile(component.component)
        component.component =  subComponent({})
        dataSource[component.name] = component
    })
    
    
    
    const htmlTemplate = Handlebars.compile(finalCode)  
    const htmlComponent = htmlTemplate(dataSource)
    return htmlComponent
}


export default createHTMLComponent
