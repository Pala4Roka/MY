import json
from pathlib import Path

try:
    import pygltflib
    print("pygltflib available")
except ImportError:
    print("Installing pygltflib...")
    import subprocess
    subprocess.run(["pip", "install", "pygltflib"], check=True)
    import pygltflib

# Load the GLB model
glb_path = Path("/app/frontend/public/Mal0_Base_20.glb")
gltf = pygltflib.GLTF2().load(str(glb_path))

print(f"Model loaded: {glb_path}")
print(f"Number of scenes: {len(gltf.scenes)}")
print(f"Number of nodes: {len(gltf.nodes)}")
print(f"Number of meshes: {len(gltf.meshes)}")
print(f"Number of materials: {len(gltf.materials) if gltf.materials else 0}")
print(f"Number of skins: {len(gltf.skins) if gltf.skins else 0}")
print(f"Number of animations: {len(gltf.animations) if gltf.animations else 0}")

# Check for bones/skeleton
if gltf.skins:
    print("\n=== SKELETON STRUCTURE ===")
    for i, skin in enumerate(gltf.skins):
        print(f"\nSkin {i}:")
        print(f"  Joints: {len(skin.joints)} bones")
        print(f"  Skeleton root: {skin.skeleton}")
        
        # Get bone names
        for j, joint_idx in enumerate(skin.joints):
            node = gltf.nodes[joint_idx]
            bone_name = node.name if node.name else f"Bone_{j}"
            print(f"    - {bone_name}")

# Check for animations
if gltf.animations:
    print("\n=== ANIMATIONS ===")
    for i, animation in enumerate(gltf.animations):
        anim_name = animation.name if animation.name else f"Animation_{i}"
        print(f"\nAnimation {i}: {anim_name}")
        print(f"  Channels: {len(animation.channels)}")
        print(f"  Samplers: {len(animation.samplers)}")
else:
    print("\n=== NO ANIMATIONS FOUND ===")
    print("The model does not contain any pre-built animations.")
    print("We will need to create procedural bone animations programmatically.")
