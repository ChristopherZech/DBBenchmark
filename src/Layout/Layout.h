/*
 * Layout.h
 *
 */

#include "Relationship.h"
#include <cmath>
#include <algorithm>

#ifndef SRC_LAYOUT_LAYOUT_H_
#define SRC_LAYOUT_LAYOUT_H_

namespace HDDTest
{
enum DistributionMode {ORDERED, UNORDERED};

struct RelationshipConfig
{
	unsigned int size;
	std::string name;
};


struct LayoutSettings
{
	std::string mode;
	uint64_t pageSizeInKB;
	uint64_t pagesPerExtent;
	std::vector<struct RelationshipConfig> relationships;
};

class Layout
{
public:
	Layout(struct LayoutSettings);
	virtual ~Layout();

	void createRelationships(std::vector<struct RelationshipConfig>);

	uint64_t diskStart;


	HDDTest::Relationship *getRelationship(std::string);

	int getExtentSizeInPages() const {
		return extentSizeInPages;
	}

	int getPageSizeInKB() const {
		return pageSizeInKB;
	}

	int getExtentSizeInKB() const {
			return getPageSizeInKB()*getExtentSizeInPages();
	}

private:
	std::vector<Relationship *> relationships;
	int extentSizeInPages;
	int pageSizeInKB;
	void init_rand();
	DistributionMode distributionOrder;


};

} /* namespace HDDTest */

#endif /* SRC_LAYOUT_LAYOUT_H_ */
