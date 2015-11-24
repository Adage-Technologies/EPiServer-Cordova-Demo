using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Net.Http;

namespace EPiServerAscend2015Demo.Helpers
{
    public static class MvcHelper
    {
        /// <summary>
        /// Gets and HtmlHelper class assuming a running HttpContext
        /// </summary>
        /// <returns></returns>
        public static HtmlHelper<object> GetHtmlHelper()
        {
            return GetHtmlHelper(HttpContext.Current);
        }

        public static HtmlHelper<object> GetHtmlHelper(System.Web.HttpContext currentContext)
        {
            return GetHtmlHelper(currentContext, new ViewDataDictionary());
        }

        public static HtmlHelper<object> GetHtmlHelper(System.Web.HttpContext currentContext, ViewDataDictionary viewDataDictionary)
        {
            HttpContextBase httpcontext = new HttpContextWrapper(currentContext);
           
            ViewContext viewContext = new ViewContext()
            {
                HttpContext = httpcontext,
                RouteData = currentContext.Request.RequestContext.RouteData,
                ViewData = viewDataDictionary,
                TempData = new TempDataDictionary()
            };

            HtmlHelper<object> htmlHelper = new HtmlHelper<object>(viewContext, new MockViewDataContainer(viewDataDictionary));
            return htmlHelper;
        }

        #region mock class for the view data container

        private class MockViewDataContainer : IViewDataContainer
        {
            public MockViewDataContainer(ViewDataDictionary currentDictionary)
            {
                ViewData = currentDictionary;
            }

            public ViewDataDictionary ViewData
            {
                get;
                set;
            }
        }

        #endregion
    }
}