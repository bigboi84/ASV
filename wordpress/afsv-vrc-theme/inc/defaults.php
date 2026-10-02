<?php
/**
 * Default navigation and footer columns, used until WordPress menus are assigned.
 * Generated from src/data/site.json.
 */

defined( "ABSPATH" ) || exit;

function afsv_default_nav() {
	return array(
	  array("label" => "Home", "href" => "/"),
	  array("label" => "About", "kids" => array(
	      array("label" => "About Us", "href" => "/about"),
	      array("label" => "Leadership", "href" => "/leadership"),
	      array("label" => "Strategic Pillars", "href" => "/strategic-pillars"),
	      array("label" => "News, Stories & Impact", "href" => "/news-impact")
	    )),
	  array("label" => "Smart Sports Village", "kids" => array(
	      array("label" => "Whitby Smart Sports Village", "href" => "/whitby-smart-sports-village"),
	      array("label" => "Facilities", "href" => "/facilities")
	    )),
	  array("label" => "Programs", "kids" => array(
	      array("label" => "Programs & Athlete Development", "href" => "/programs"),
	      array("label" => "Education & Academic Success", "href" => "/education"),
	      array("label" => "Life Skills", "href" => "/life-skills"),
	      array("label" => "Esports, Technology, Media & Innovation", "href" => "/technology-media"),
	      array("label" => "GAISB AI Education & Responsible Innovation", "href" => "/gaisb-ai")
	    )),
	  array("label" => "Neurodiversity", "kids" => array(
	      array("label" => "Neurodiversity Access & Opportunity", "href" => "/neurodiversity"),
	      array("label" => "Business for Inclusion", "href" => "/business-for-inclusion"),
	      array("label" => "Service Provider Network", "href" => "/service-provider-network"),
	      array("label" => "Neurodiversity Access Fund", "href" => "/neurodiversity-access-fund")
	    )),
	  array("label" => "Membership", "href" => "/membership"),
	  array("label" => "Marketplace", "href" => "/marketplace"),
	  array("label" => "Partners", "href" => "/partners")
	);
}

function afsv_default_footer_columns() {
	return array(
	  array("title" => "Explore", "links" => array(
	      array("label" => "About Us", "href" => "/about"),
	      array("label" => "Leadership", "href" => "/leadership"),
	      array("label" => "Strategic Pillars", "href" => "/strategic-pillars"),
	      array("label" => "Whitby Smart Sports Village", "href" => "/whitby-smart-sports-village"),
	      array("label" => "Facilities", "href" => "/facilities"),
	      array("label" => "Membership", "href" => "/membership"),
	      array("label" => "Marketplace", "href" => "/marketplace")
	    )),
	  array("title" => "Programs", "links" => array(
	      array("label" => "Programs & Athlete Development", "href" => "/programs"),
	      array("label" => "Education & Academic Success", "href" => "/education"),
	      array("label" => "Life Skills", "href" => "/life-skills"),
	      array("label" => "Esports, Technology, Media & Innovation", "href" => "/technology-media"),
	      array("label" => "GAISB AI Education", "href" => "/gaisb-ai")
	    )),
	  array("title" => "Events", "links" => array(
	      array("label" => "GAISB AI World Summit 2027", "href" => "/events"),
	      array("label" => "Summit website", "href" => "https://gaisb.ai/port-of-spain.html"),
	      array("label" => "All events", "href" => "/events")
	    )),
	  array("title" => "Inclusion & impact", "links" => array(
	      array("label" => "Neurodiversity Access & Opportunity", "href" => "/neurodiversity"),
	      array("label" => "Business for Inclusion", "href" => "/business-for-inclusion"),
	      array("label" => "Service Provider Network", "href" => "/service-provider-network"),
	      array("label" => "Neurodiversity Access Fund", "href" => "/neurodiversity-access-fund"),
	      array("label" => "News, Stories & Impact", "href" => "/news-impact"),
	      array("label" => "Accessibility, Privacy & Safeguarding", "href" => "/accessibility-privacy"),
	      array("label" => "Legal & Policy Pages", "href" => "/legal")
	    )),
	  array("title" => "Get in touch", "links" => array(
	      array("label" => "Contact Us", "href" => "/contact"),
	      array("label" => "Book Now", "href" => "https://book.afsvvrc.com"),
	      array("label" => "Partners & Sponsors", "href" => "/partners"),
	      array("label" => "Become a Vendor", "href" => "/marketplace"),
	      array("label" => "Service Provider Network", "href" => "/service-provider-network")
	    ))
	);
}
