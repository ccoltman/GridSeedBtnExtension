using System;
using SwarmUI.Core;

namespace SwarmUI.Extensions.GridSeedBtn
{
    public class GridSeedBtnExtension : Extension
    {
        public override void OnInit()
        {
            // Maps the asset folder file cleanly to Swarm's script array loader
            ScriptFiles.Add("Assets/seed.js");
        }
    }
}
