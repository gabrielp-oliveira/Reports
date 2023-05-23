import express  from'express'
const app = express()
import http from'http'
const server = http.createServer(app)
import createHTMLComponent from './pdfComponent.js'

import * as fs from 'fs';




const dataPath = `pdf\\tabaco\\tabacoData.json`
const dataSource = fs.readFileSync(dataPath, 'utf-8')
const dataObject = JSON.parse(dataSource)

app.get('/tabaco',(req, res) => {
  
    res.send(createHTMLComponent('tabaco', dataObject))
  })

  app.get('/childrens',(req, res) => {


    
    const auditTotal = createHTMLComponent('auditTotal', dataObject.auditTotal)

    // adding a children(auditDetails) to the parent(auditDetails)
    // adding children to the parent body, the parent must call the children in the HTML file.
    const auditDetails = createHTMLComponent('auditDetails', dataObject.auditDetails, 
    [{name: 'total', component: auditTotal}])
    
      const header = createHTMLComponent('header', dataObject.header)
      const subHeader = createHTMLComponent('subHeader', dataObject.subHeader)
      const comments = createHTMLComponent('comments', dataObject.comments)
      const associateDetails = createHTMLComponent('associateDetails', dataObject.associateDetails)
      const CustRepSignatures = createHTMLComponent('CustRepSignatures', dataObject.CustRepSignatures)
      const itemDetails = createHTMLComponent('itemDetails', dataObject.itemDetails)
      const notes = createHTMLComponent('notes', dataObject.notes)
  
      // adding children to the parent body, the parent must call the children in the HTML file.
      const pdfBody = createHTMLComponent('body', {}, [
        {name:'header', component: header},
        {name: 'subHeader', component: subHeader},
        {name: 'auditDetails', component: auditDetails},
        {name: 'comments', component: comments},
        {name: 'associateDetails', component: associateDetails},
        {name: 'CustRepSignatures', component: CustRepSignatures},
        {name: 'itemDetails', component: itemDetails},
        {name: 'notes', component: notes},
      ])
      res.send(pdfBody)
  })



server.listen(process.env.PORT || 8080, console.log('server started'))


