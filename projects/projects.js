import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

let query = '';
let currSearchFilter = projects;
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
    // update query value
    query = event.target.value;
    if (query === '') {
        currWedgeFilter = projects;
    }
    // filter the projects
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
    currSearchFilter = filteredProjects;
    // render updated projects!
    renderProjects(currSearchFilter.filter(item => currWedgeFilter.includes(item)), projectsContainer, 'h2');
    renderPieChart(currSearchFilter.filter(item => currWedgeFilter.includes(item)));
});

let currWedgeFilter = projects;
function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year };
    });
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    let newSVG = d3.select('svg'); 
    newSVG.selectAll('path').remove();
    let newLegend = d3.select('.legend'); 
    newLegend.selectAll('li').remove();
    newArcs.forEach((arc, idx) => {
        // fill in step for appending path to svg using D3
        newSVG.append('path').attr('d', arc).attr('fill', colors(idx));
    })
    newData.forEach((d, idx) => {
    newLegend.append('li')
          .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
          .attr('class', 'legend-item')
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    })

    let selectedIndex = -1;
    let svg = d3.select('svg');
    svg.selectAll('path').remove();
    newArcs.forEach((arc, i) => {
      svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
  
      svg
        .selectAll('path')
        .attr('class', (_, idx) => (
        // filter idx to find correct pie slice and apply CSS from above
        idx === selectedIndex ? 'selected' : ''
        ));

      newLegend
        .selectAll('li')
        .attr('class', (_, idx) => (
          // filter idx to find correct legend and apply CSS from above
          idx === selectedIndex ? "selected" : ""
        ));

      if (selectedIndex === -1) {
        currWedgeFilter = projects;
        renderProjects(currSearchFilter, projectsContainer, 'h2');
      } else {
        // filter projects and project them onto webpage
        let selectedYear = newData[selectedIndex].label;
        let filteredProjects = projects.filter(project => project.year === selectedYear);
        currWedgeFilter = filteredProjects;
        renderProjects(currSearchFilter.filter(item => currWedgeFilter.includes(item)), projectsContainer, 'h2');
      }
    });
  });
}

// Initial render on page load
renderPieChart(currSearchFilter.filter(item => currWedgeFilter.includes(item)));
