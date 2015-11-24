using EPiServer;
using EPiServer.Core;
using EPiServer.Web.Mvc.Html;
using EPiServerAscend2015Demo.Models.Pages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EPiServerAscend2015Demo.Helpers;
using System.Text.RegularExpressions;
using EPiServer.Web.Routing;

namespace EPiServerAscend2015Demo.Controllers
{
    public class MobilePageDataController : ApiController
    {
        private IContentLoader _contentLoader { get; set; }

        public MobilePageDataController(IContentLoader contentLoader)
        {
            this._contentLoader = contentLoader;
        }

        [HttpGet]
        public IHttpActionResult Get(int id)
        {
            var reference = new ContentReference(id);
            if (ContentReference.IsNullOrEmpty(reference))
            {
                var message = new HttpResponseMessage();
                message.StatusCode = HttpStatusCode.NotFound;
                message.ReasonPhrase = String.Format("Did not find page content with id {0}", id);
                throw new HttpResponseException(message);
            }

            var pageData = this._contentLoader.Get<PageData>(reference) as MobilePageData;
            if (pageData == null)
            {
                var message = new HttpResponseMessage();
                message.StatusCode = HttpStatusCode.Forbidden;
                message.ReasonPhrase = String.Format("Page with id {0} was not of type {1}", id, typeof(MobilePageData).Name);
                throw new HttpResponseException(message);
            }

            var epiTitle = pageData.Title;
            var epiContent = PreProcess(pageData.Content);
            
            return Ok(new { title = epiTitle, content = epiContent });
        }

        private string PreProcess(XhtmlString xhtmlString)
        {
            // The store value of an XhtmlString contains placeholder content for certain dynamic content.  We want to
            // pre-load this data to before we send it off to the app.  In order to load personalized content, dynamic controls, etc., 
            // we use the following methods to get the "rendered results" of the XhtmlString property
            var htmlHelper = Helpers.MvcHelper.GetHtmlHelper();
            string mvcHtmlResults = EPiServer.Web.Mvc.Html.XhtmlStringExtensions.XhtmlString(htmlHelper, xhtmlString).ToHtmlString();

            // replace image URLs with a full URL path
            string workingResults = Regex.Replace(mvcHtmlResults, "<img(.+?)src=[\"\']/(.+?)[\"\'](.+?)>", "<img $1 src=\"http://ascend-dev.adagetechnologies.com/$2\" $3>");

            // find all internal href items
            var regexMatches = Regex.Matches(mvcHtmlResults, "href=[\"\'](.*?)[\"\']");
            var resolver = EPiServer.ServiceLocation.ServiceLocator.Current.GetInstance<UrlResolver>();
            
            // for each item attempt to determine if they are an internal page link
            foreach(Match eachUrlMatch in regexMatches)
            {
                UrlBuilder eachUrl = new UrlBuilder(eachUrlMatch.Groups[1].Value);
                var currentRoute = resolver.Route(eachUrl);
                if (currentRoute != null)
                {
                    string internalContentLink = string.Format("href=\"index.html#/app/content/{0}\"", currentRoute.ContentLink.ID);
                    workingResults = workingResults.Replace(eachUrlMatch.Value, internalContentLink);
                }
            }

            return workingResults;
        }
    }
}
