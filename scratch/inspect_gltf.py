import json
import struct

def inspect_glb(file_path):
    with open(file_path, 'rb') as f:
        # GLB Header
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a glTF file")
            return
        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<I', f.read(4))[0]
        print(f"GLB Version: {version}, Total Length: {length}")

        # JSON Chunk
        chunk_length = struct.unpack('<I', f.read(4))[0]
        chunk_type = f.read(4)
        if chunk_type != b'JSON':
            print("Expected JSON chunk")
            return
        
        json_data = f.read(chunk_length).decode('utf-8')
        gltf = json.loads(json_data)
        
        # Nodes / Meshes
        print("\n--- NODES ---")
        for i, node in enumerate(gltf.get('nodes', [])):
            name = node.get('name', 'Unnamed')
            mesh_idx = node.get('mesh')
            print(f"Node {i}: {name} (Mesh: {mesh_idx})")
            
        print("\n--- MESHES ---")
        for i, mesh in enumerate(gltf.get('meshes', [])):
            name = mesh.get('name', 'Unnamed')
            print(f"Mesh {i}: {name}")
            
        print("\n--- MATERIALS ---")
        for i, mat in enumerate(gltf.get('materials', [])):
            name = mat.get('name', 'Unnamed')
            pbr = mat.get('pbrMetallicRoughness', {})
            color = pbr.get('baseColorFactor', 'Default')
            print(f"Material {i}: {name} - Color: {color}")

if __name__ == '__main__':
    inspect_glb(r"d:\NeuroAI Problem\frontend\public\brain.glb")
