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
        var id = vertices.length;
        var origin = he.getOrigin();
        // var twin = he.getTwin();

        var dest = he.getTwin().getOrigin().getPos();
        var position = origin.getPos();

        var middle = position.add(dest).multiply(0.5);
        var middleVertex = mesh.addVertexPos(middle.x(), middle.y(), middle.z(), id);
        // flag v as new
        this.newVertices.add(middleVertex);
        // add two new half-edges to mesh
        var heOne = mesh.addHalfEdge();
        var heTwo = mesh.addHalfEdge();
        // set affected edges
        he.getOrigin().setEdge(heOne);
        heOne.setOrigin(origin);
        heOne.setNext(he);
        heOne.setPrev(he.getPrev());
        heOne.setTwin(heTwo);
        he.getPrev().setNext(heOne);
        he.setPrev(heOne);
        heTwo.setOrigin(middleVertex);
        middleVertex.setEdge(heTwo);
        heTwo.setPrev(he.getTwin());
        heTwo.setNext(he.getTwin().getNext());
        heTwo.setTwin(heOne);
        he.getTwin().getNext().setPrev(heTwo);
        he.getTwin().setNext(heTwo);
        he.setOrigin(middleVertex);
        // set already split flags
        [he, he.getTwin(), heOne, heTwo].forEach(item => this.splitEdges.add(item));
    }

    this.cornerCut = function(face, mesh) {
        var faceEdge = face.getEdge()
        var retVal = false;
        // check if the face is already triangular 
        if(faceEdge.getNext().getNext().getNext() === faceEdge)
        {
            console.log("==============================");
            console.log("something is wrong: face is triangular already");
            console.log("==============================");
        }
        if(faceEdge.getNext().getNext().getNext().getNext() === faceEdge)
        {
            retVal = true;
        }

        // ading new half edges
        var heNew = mesh.addHalfEdge();
        var newTwin = mesh.addHalfEdge();
        [heNew, newTwin].forEach(item => this.splitEdges.add(item));
        var v1 = faceEdge.getOrigin();
        // do all the common stuff
        var v2 = faceEdge.getPrev().getOrigin();
        var v3 = faceEdge.getPrev().getPrev().getOrigin();
        heNew.setOrigin(v1);
        heNew.setPrev(faceEdge.getPrev());
        heNew.setNext(faceEdge.getPrev().getPrev());
        heNew.setTwin(newTwin);
        newTwin.setOrigin(v3);
        newTwin.setPrev(faceEdge.getPrev().getPrev().getPrev());
        newTwin.setNext(faceEdge);
        newTwin.setTwin(heNew);
        newTwin.setFace(face);
        faceEdge.getPrev().setNext(heNew);
        faceEdge.getPrev().getPrev().getPrev().setNext(newTwin);
        faceEdge.getPrev().getPrev().setPrev(heNew);
        faceEdge.setPrev(newTwin);
        var newFace = mesh.addFaceByHE(heNew.getPrev(), heNew, heNew.getNext());
        // figure out the specific case / set the he for original face
        face.setEdge(newTwin);

        return retVal;
    }

    this.notTriangular = function (face){
        var edge = face.getEdge();
        if(edge === edge.getNext().getNext().getNext()){
            return false;
        }
        return true;
    }

    this.subdivide = function (level) {
        // Subdivides the control mesh to the given subdivision level.
        // Returns the subdivided mesh.

        // HINT: Create a new subdivision mesh for each subdivision level and 
        // store it in memory for later.
        // If the calling code asks for a level that has already been computed,
        // just return the pre-computed mesh!

        last_level = this.meshes.length - 1;
        if(level > last_level)
        {   
            last_mesh = this.meshes[last_level];
            new_mesh = new Mesh();
            new_mesh.copyMesh(last_mesh);
            this.newVertices.clear();
            this.splitEdges.clear();
            // while there is an half edge that is not split
            // do splitedge he
            var i = 0;
            while(i < new_mesh.getEdges().length)
            {

                if(this.splitEdges.has(new_mesh.getEdges()[i]))
                {
                    i++;
                }
                else
                {
                    this.edgeSplit(new_mesh.getEdges()[i], new_mesh);
                    i++;
                }
            }

            var j=0;
            while(this.notTriangular(new_mesh.getFaces()[j]) && j < new_mesh.getFaces().length)
            {  
                if(this.cornerCut(new_mesh.getFaces()[j], new_mesh))
                {
                    j++;
                }
            }
            new_mesh.computeNormal();
            this.meshes.push(new_mesh);
            return new_mesh;
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