import os, argparse
import UnityPy

def unpack_one_asset(source_path: str, dest_folder: str):
    # load that file via UnityPy.load
    env = UnityPy.load(source_path)
    # alternative way which keeps the original path
    for path, obj in env.container.items():
        if obj.type.name in ["Texture2D", "Sprite"]:
            data = obj.read()
            # create dest based on original path
            dest = os.path.join(dest_folder, *path.split("/"))
            # make sure that the dir of that path exists
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            # correct extension
            dest, ext = os.path.splitext(dest)
            dest = dest + ".png"
            data.image.save(dest)
            print(f"Saved: \"{dest}\"")

def main():
    parser = argparse.ArgumentParser(description="Process a file and save to a folder.")
    parser.add_argument("-i", "--input", type=str, required=True, help="Input file path")
    parser.add_argument("-o", "--output", type=str, required=True, help="Output folder path")
    args = parser.parse_args()

    unpack_one_asset(args.input, args.output)

if __name__ == "__main__":
    main()


