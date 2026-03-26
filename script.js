/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  font-family: 'Arial', sans-serif;
  color: #fff;
  overflow-x: hidden;
  position: relative;
}

/* Moving tech background container */
#background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

/* Header */
.header {
  text-align: center;
  padding: 100px 20px 50px 20px;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.header p {
  font-size: 1.2rem;
  color: #00ffcc;
}

/* Projects */
.projects {
  padding: 50px 20px;
  text-align: center;
}

.project-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.project-card {
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00ffcc;
  border-radius: 10px;
  padding: 20px;
  width: 250px;
  transition: transform 0.3s, background 0.3s;
}

.project-card:hover {
  transform: scale(1.05);
  background: rgba(0, 255, 204, 0.2);
}

/* Contact */
.contact {
  text-align: center;
  padding: 50px 20px;
  background: rgba(0,0,0,0.5);
}

.contact a {
  color: #00ffcc;
  text-decoration: none;
  font-weight: bold;
}

footer {
  text-align: center;
  padding: 20px;
  background: rgba(0,0,0,0.6);
  font-size: 0.9rem;
}
