function subdivider (input_mesh) {
    this.meshes = [];

    // flags
    this.newVertices = new Set();
    this.splitEdges = new Set();
    
    // Initializes this subdivision object with a mesh to use as 
    // the control mesh (ie: subdivision level 0).
    this.meshes.push(input_mesh);


    this.edgeSplit = function(he, mesh) {
        // define new vertex V
        var vertices = mesh.getVertices();
        var id = vertices[vertices.length - 1].getId() + 1;
        var orign = he.getOrign();
        var twin = he.getTwin();
        var dest = twin.getOrign();
        var middle = origin.add(dest).multiply(0.5);
        var v = new Vertex(middle.x, middle.y, middle.z, id);
        // mark V as new
        this.newVertices.add(id);
        // add two new half-edges to mesh
        var heOne = mesh.addHalfEdge();
        var heTwo = mesh.addHalfEdge();
        // set affected edges
        heOne.setOrigin(origin);
        heOne.setNext(he);
        heOne.setPrev(he.getPrev());
        he.setPrev(heOne);
        heTwo.setOrigin(middle);
        heTwo.setPrev(twin);
        heTwo.setNext(twin.getNext());
        twin.setNext(heTwo);
        he.setOrigin(middle);
        [he, twin, heOne, heTwo].forEach(item => this.splitEdges.add(item));

        


    }

    this.cornerCut = function() {

    }

    this.subdivide = function (level) {
        // Subdivides the control mesh to the given subdivision level.
        // Returns the subdivided mesh.

        // HINT: Create a new subdivision mesh for each subdivision level and 
        // store it in memory for later.
        // If the calling code asks for a level that has already been computed,
        // just return the pre-computed mesh!
        // return 1; // REPLACE THIS!
        last_level = this.meshes.length - 1;
        console.log(1);
        if(level > last_level)
        {   
            last_mesh = this.meshes[last_level];
            new_mesh = new Mesh();
            new_mesh.copyMesh(last_mesh);
        }
        else
        {
            return this.meshes[level];
        }
        
        //@@@@@
        // YOUR CODE HERE
        //@@@@@ 
    }

    this.clear = function (m) {
        this.meshes = [];
    }
}