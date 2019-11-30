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
        // flag v as new
        this.newVertices.add(middle);
        // add two new half-edges to mesh
        var heOne = mesh.addHalfEdge();
        var heTwo = mesh.addHalfEdge();
        // set affected edges
        heOne.setOrigin(origin);
        heOne.setNext(he);
        heOne.setPrev(he.getPrev());
        heOne.setTwin(heTwo);
        he.setPrev(heOne);
        heTwo.setOrigin(middle);
        heTwo.setPrev(twin);
        heTwo.setNext(twin.getNext());
        heTwo.setTwin(heOne);
        twin.setNext(heTwo);
        he.setOrigin(middle);
        // set already split flags
        [he, twin, heOne, heTwo].forEach(item => this.splitEdges.add(item));
    }

    this.cornerCut = function(face, mesh) {
        var faceEdge = face.getEdge()

        // check if the face is already triangular 
        if(faceEdge.getNext().getNext().getNext() == faceEdge)
        {
            console.log("==============================");
            console.log("something is wrong: face is triangular already");
            console.log("==============================");
        }

        var heNew = mesh.addHalfEdge();
        var newTwin = mesh.addHalfEdge();
        [heNew, newTwin].forEach(item => this.splitEdges.add(item));
        var origin = faceEdge.getOrigin();

        // do all the common stuff
        var v2 = faceEdge.getNext().getOrigin();
        var v3 = faceEdge.getPrev().getOrigin();
        heNew.setOrigin(v2);
        heNew.setPrev(faceEdge);
        heNew.setNext(faceEdge.getPrev());
        heNew.setTwin(newTwin);
        newTwin.setOrigin(v3);
        newTwin.setPrev(faceEdge.getPrev().getPrev());
        newTwin.setNext(faceEdge.getNext());
        newTwin.setTwin(heNew);
        newTwin.setFace(face);
        faceEdge.setNext(heNew);
        faceEdge.getPrev().setPrev(heNew);
        var newFace = mesh.addFaceByHE(faceEdge, heNew, faceEdge.getPrev());

        // figure out the specific case / set the he for original face
        face.setEdge(newTwin.getPrev());
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