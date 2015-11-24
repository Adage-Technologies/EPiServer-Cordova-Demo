using System;
using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using EPiServer.Cms.AddOns.Blocks;
using EPiServerAscend2015Demo.Models.Blocks;
using EPiServer.Web.PropertyControls;
using System.IO;
using System.Web.UI;
namespace EPiServerAscend2015Demo.Models.Pages
{
    [JsonObject(MemberSerialization.OptIn)]
    [ContentType(DisplayName = "Mobile Content Page", GUID = "c702fc20-60a4-433d-b09e-64a3e44f0e5d", Description = "Mobile content")]
    public class MobilePageData : PageData
    {
        [Display(Name = "Title", Order = 1)]
        public virtual string Title { get; set; }

        [Display(Name = "Content", Order = 2)]
        public virtual XhtmlString Content { get; set; }

    }
}