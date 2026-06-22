{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.postgresql
  ];
  idx = {
    extensions = [];
    workspace = {
      onCreate = {
        install = "cd frontend && npm install";
      };
      onStart = {
        dev = "cd frontend && npm run dev";
      };
    };
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0"];
          cwd = "frontend";
          manager = "web";
        };
      };
    };
  };
}
